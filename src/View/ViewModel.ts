import React from "react";
import { ObservableSet, makeObservable, observable } from "mobx";
import { EXPANSION_KEYS } from "../Constants/faction-data";
import { ExperienceLevels, User } from "../Constants/user";

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


    constructor() {
        makeObservable(this);
    }


    ToggleExpansion(exp: EXPANSION_KEYS, state?: boolean) {
        if(state === true || !this.Expansions.has(exp))
            this.Expansions.add(exp);
        else
            this.Expansions.delete(exp);
    }

    AddUser() {
        const id = ++userCount;
        this.Users.push({
            id,
            experience: ExperienceLevels.intermediate,
            name: `Player ${id}`,
        });
    }
}



export const VIEW_MODEL_CONTEXT = React.createContext<ViewModel>(ViewModel.Instance);
export const useViewModel = () => React.useContext(VIEW_MODEL_CONTEXT);