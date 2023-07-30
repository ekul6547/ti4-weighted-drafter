import { EXPANSION_KEYS, FACTIONS, FACTIONS_FILTERED, FACTION_ARR, FACTION_DETAILS, Faction, SCORE_TO_WEIGHT } from "../Constants/faction-data";
import { ExperienceLevels, User } from "../Constants/user";




export function randFaction(
    factions: FACTIONS[],
    experience: ExperienceLevels,
    taken: Set<Faction>,
    playerCount: number,
    expansions: Set<EXPANSION_KEYS>,
): Faction | null {
    const weighted: FACTIONS[] = factions.map<FACTIONS[]>(f => {
        const fac: Faction = FACTION_DETAILS[f];

        const diff = fac.complexityWeight[experience];
        if(diff == null || taken.has(fac)) {
            return [];
        }
        const weight = Math.max(
            1
            + diff
            + SCORE_TO_WEIGHT[fac.score(expansions)][experience]
            + (experience <= ExperienceLevels.beginner && fac.bonusFunness || 0)
            + (fac.playerCountModifier?.(playerCount) || 0)
            , 1
        );
        console.log("faction weight:", fac.key, weight);
        return new Array<FACTIONS>(weight).fill(f);
    }).flat().sort((a,b) => {
        return Math.random() > 0.5 ? 1 : -1;
    });

    if(weighted.length == 0) return null;

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

    const factionsFiltered = FACTIONS_FILTERED(expansions, users);

    draftCount = Math.min(draftCount, Math.floor(factionsFiltered.length / users.length));

    console.log("starting drafting. U:", users.length, "D:", draftCount)

    // lowest experience first
    const sortedUsers = users.slice().sort((a,b) => {
        return a.experience - b.experience;
    })

    for(let i = 0; i < draftCount; i++) {
        for(const u of sortedUsers) {
            if(i == 0) {
                output.set(u, {
                    user: u,
                    factions: []
                });
            }

            const res = output.get(u);
            console.log("Drafting for user", u.name, "experience: ", u.experience)

            let fact = randFaction(
                factionsFiltered,
                u.experience,
                taken,
                users.length,
                expansions
            );

            if(fact == null) {
                console.log("none left, so stealing")
                // swap because all that are left are null ones (avoid for experience level)
                for(let ii = sortedUsers.length-1; ii >= 0; ii--) {
                    const other = sortedUsers[ii];
                    if(other.experience === u.experience) continue;
                    const otherDrafted = output.get(other);
                    if(!otherDrafted) continue;
                    const toSwap = randFaction(
                        factionsFiltered,
                        other.experience,
                        taken,
                        users.length,
                        expansions
                    );
                    if(toSwap == null) throw "Wtf?";

                    const toStealList = otherDrafted.factions.filter(f => {
                        if(f.complexityWeight[u.experience] === null) return false;
                        return true;
                    }).sort((a,b) => {
                        return b.complexityWeight[u.experience]! - a.complexityWeight[u.experience]!;
                    });
                    const toSteal = toStealList[0];
                    console.log("swapped", toSteal?.key, "with", toSwap?.key, "from", other.name/* , otherDrafted, Array.from(taken.values()).map(f => f.key) */);
                    const toStealIndex = otherDrafted.factions.findIndex(f => f.key === toSteal.key);
                    otherDrafted.factions[toStealIndex] = toSwap;
                    fact = toSteal;
                    taken.add(toSwap);
                    break;
                }
                console.log("redrafted", fact!.name)
            } else {
                console.log("drafted", fact!.name/* , Array.from(taken.values()).map(f => f.key) */)
            }
            taken.add(fact!);
            res?.factions.push(fact!);
        }
    }

    return Array.from(output.values());
}