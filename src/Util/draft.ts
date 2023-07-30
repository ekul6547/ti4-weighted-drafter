import { EXPANSION_KEYS, FACTIONS, FACTION_ARR, FACTION_DETAILS, Faction, SCORE_TO_WEIGHT } from "../Constants/faction-data";
import { ExperienceLevels, User } from "../Constants/user";




export function randFaction(
    factions: FACTIONS[],
    experience: ExperienceLevels,
    taken: Set<Faction>,
    playerCount: number,
    expansions: Set<EXPANSION_KEYS>,
): Faction {
    
    const weighted: FACTIONS[] = factions.map<FACTIONS[]>(f => {
        const fac: Faction = FACTION_DETAILS[f];

        const diff = fac.complexityWeight[experience];
        if(diff == null || taken.has(fac)) {
            return []
        }
        const weight = Math.max(
            1
            + diff
            + SCORE_TO_WEIGHT[fac.score(expansions)][experience]
            + (experience <= ExperienceLevels.beginner && fac.bonusFunness || 0)
            + (fac.playerCountModifier?.(playerCount) || 0)
            , 1
        );
        return new Array<FACTIONS>(weight).fill(f);
    }).flat().sort((a,b) => {
        return Math.random() > 0.5 ? 1 : -1;
    });


    const index = Math.floor(Math.random() * weighted.length);
    const key = weighted[index];

    return FACTION_DETAILS[key];
}



interface DraftResult {
    user: User;
    factions: Faction[];
}

export function Draft(users: User[], draftCount: number, expansions: Set<EXPANSION_KEYS>): DraftResult[] {
    const output = new Map<User, DraftResult>();
    const taken = new Set<Faction>();

    const factionsFiltered = FACTION_ARR.filter(f => {
        const fac: Faction = FACTION_DETAILS[f];
        if(fac.expansion != null && !expansions.has(fac.expansion))
            return false;
        return true;
    });

    draftCount = Math.min(draftCount, Math.floor(factionsFiltered.length / users.length));

    for(let i = 0; i < draftCount; i++) {
        for(const u of users) {
            if(i == 0) {
                output.set(u, {
                    user: u,
                    factions: []
                });
            }

            const res = output.get(u);

            const fact = randFaction(
                factionsFiltered,
                u.experience,
                taken,
                users.length,
                expansions
            );
            taken.add(fact);
            res?.factions.push(fact);
        }
    }

    return Array.from(output.values());
}