import React from "react";
import { ObservableMap, ObservableSet, action, computed, makeObservable, observable } from "mobx";
import { EXPANSION_KEYS, FACTIONS_FILTERED, FACTION_ARR, FACTION_DETAILS, Faction } from "../Constants/faction-data";
import { ExperienceLevels, User } from "../Constants/user";
import { Draft } from "../Util/draft";
import { isThisTypeNode } from "typescript";

let userCount = 0;

export class ViewModel {
    private static _instance: ViewModel | null;
    public static get Instance(): ViewModel {
        return ViewModel._instance ?? (ViewModel._instance = new ViewModel());
    }

    @observable
    public Expansions: Set<EXPANSION_KEYS> = new ObservableSet<EXPANSION_KEYS>([
        "pok",
        "codex1",
        "codex2",
        "codex3"
    ]);

    @observable
    public Users: User[] = [];

    @observable
    public Drafted: Map<User, Faction[]> = new ObservableMap<User, Faction[]>();

    @computed
    public get MaxDraftCount(): number {
        const factions = FACTIONS_FILTERED(this.Expansions, this.Users);
        return this.Users.length ? Math.floor(factions.length / this.Users.length) : factions.length;
    }

    @observable
    public DraftCount: number = 3;


    @observable
    public AssignSpeaker: boolean = true;

    @observable
    public Speaker: number | null = null;


    constructor() {
        makeObservable(this);
    }

    @action
    ToggleExpansion(exp: EXPANSION_KEYS, state?: boolean) {
        if(state === true || !this.Expansions.has(exp))
            this.Expansions.add(exp);
        else
            this.Expansions.delete(exp);
    }

    @action
    AddUser() {
        const id = ++userCount;
        this.Users.push({
            id,
            experience: ExperienceLevels.intermediate,
            name: `Player ${id}`,
        });
    }

    @action
    RemoveUser(id: number) {
        const index = this.Users.findIndex(u => u.id==id);
        if(index > -1)
            this.Users.splice(index, 1);
    }

    @action
    Draft() {
        const results = Draft(this.Users, Math.min(this.DraftCount, this.MaxDraftCount), this.Expansions).sort((a,b) => {
            const aIndex = this.Users.findIndex(u => u.id === a.user.id);
            const bIndex = this.Users.findIndex(u => u.id === b.user.id);
            return aIndex - bIndex;
        });
        this.Drafted.clear();
        for(const r of results) {
            this.Drafted.set(r.user, r.factions);
        }
        this.randomiseSpeaker();
    }

    private randomiseSpeaker() {
        if(!this.AssignSpeaker || this.Users.length === 0) {
            this.Speaker = null;
            return;
        }

        const users = this.Users;

        // weight inversely, so less experienced players have a higher chance at becoming speaker
        const usersWeighted = users.map(u => {
            const weight = Math.floor(Math.max(ExperienceLevels.veteran - u.experience + 1, 1) / 2) + 1;
            return new Array(weight).fill(u.id);
        }).flat().sort(() => Math.random() > 0.5 ? 1 : -1);

        this.Speaker = usersWeighted[Math.floor(Math.random() * usersWeighted.length)];
    }
}



export const VIEW_MODEL_CONTEXT = React.createContext<ViewModel>(ViewModel.Instance);
export const useViewModel = () => React.useContext(VIEW_MODEL_CONTEXT);