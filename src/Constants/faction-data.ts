import { ExperienceLevels, User } from "./user";



export const EXPANSIONS = {
    'pok': 'Prophecy Of Kings',
    'codex1': 'Codex 1',
    'codex2': 'Codex 2',
    'codex3': 'Codex 3',
} as const satisfies { [key: string]: string };

export type EXPANSION_KEYS = keyof typeof EXPANSIONS;


export type FactionStatsWeight = Record<ExperienceLevels, number | null>;

export interface Faction<F = string> {
    key: F;
    /** The name */
    name: string;
    /**
     * The extra weight for each complexity level.
     * The higher the number, the more weight to give it for drafting.
     * This is extra weighting, as there will always be a minimum of 1 when drafting.
     * However, you can give `null` to a weight to say a player of that experience should never be given that faction.
     * For example, a first-time player probably shouldn't get Nekro or Mahact
     */
    complexityWeight: FactionStatsWeight;
    /**
     * How good has the faction been ranked?
     * ranked from SCPT podcast 278: https://open.spotify.com/episode/4P2HOvUG9khuWy8kyc5cyE
     */
    score: (expansions: Set<EXPANSION_KEYS>) => 0 | 1 | 2 | 3 | 4 | (number & {});
    /**
     * Any extra bonus funness for new players?
     * Subjective based on powers, but basically, for firstTime / beginner players, will they have a lot of cool / fun powers to enjoy?
     * This bonus is not given to experience levels intermediate or higher.
     */
    bonusFunness?: number;
    /**
     * Any weight modification that should be applied based on player count
     */
    playerCountModifier?: (playerCount: number) => number,
    expansion?: EXPANSION_KEYS,

}



export type BASE_FACTIONS =
    | 'arborec'
    | 'barony'
    | 'saar'
    | 'muaat'
    | 'hacan'
    | 'sol'
    | 'creuss'
    | 'l1z1x'
    | 'mentak'
    | 'naalu'
    | 'nekro'
    | 'sardakk'
    | 'jol-nar'
    | 'winnu'
    | 'xxcha'
    | 'yin'
    | 'yssaril'
    ;
export type POK_FACTIONS =
    | 'argent'
    | 'empyrean'
    | 'mahact'
    | 'naaz-rokha'
    | 'nomad'
    | 'titans'
    | 'vuilraith'
    ;
export type CODEX_FACTIONS =
    'keleres'
    ;

export type FACTIONS = BASE_FACTIONS | POK_FACTIONS | CODEX_FACTIONS;


export const SCORE_TO_WEIGHT: Record<ReturnType<Faction['score']>, Record<ExperienceLevels, number>> = {
    [0]: {
        [ExperienceLevels.firstTime]: 0,
        [ExperienceLevels.beginner]: 1,
        [ExperienceLevels.intermediate]: 3,
        [ExperienceLevels.expert]: 4,
        [ExperienceLevels.veteran]: 5,
    },
    [1]: {
        [ExperienceLevels.firstTime]: 2,
        [ExperienceLevels.beginner]: 2,
        [ExperienceLevels.intermediate]: 3,
        [ExperienceLevels.expert]: 4,
        [ExperienceLevels.veteran]: 4,
    },
    [2]: {
        [ExperienceLevels.firstTime]: 3,
        [ExperienceLevels.beginner]: 3,
        [ExperienceLevels.intermediate]: 3,
        [ExperienceLevels.expert]: 3,
        [ExperienceLevels.veteran]: 3,
    },
    [3]: {
        [ExperienceLevels.firstTime]: 4,
        [ExperienceLevels.beginner]: 4,
        [ExperienceLevels.intermediate]: 3,
        [ExperienceLevels.expert]: 2,
        [ExperienceLevels.veteran]: 2,
    },
    [4]: {
        [ExperienceLevels.firstTime]: 5,
        [ExperienceLevels.beginner]: 4,
        [ExperienceLevels.intermediate]: 3,
        [ExperienceLevels.expert]: 2,
        [ExperienceLevels.veteran]: 1,
    }
}


export const FACTION_DETAILS: { [F in FACTIONS]: Faction<F> } = {
    'arborec': {
        key: 'arborec',
        name: 'The Arborec',
        complexityWeight: {
            [ExperienceLevels.firstTime]: null,
            [ExperienceLevels.beginner]: 2,
            [ExperienceLevels.intermediate]: 5,
            [ExperienceLevels.expert]: 4,
            [ExperienceLevels.veteran]: 4,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(25);
            //TODO - expansion modifiers
            return score;
        }
    },
    'barony': {
        key: 'barony',
        name: 'The Barony of Letnev',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 5,
            [ExperienceLevels.beginner]: 5,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 2,
            [ExperienceLevels.veteran]: 2,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(18);
            //TODO - expansion modifiers
            return score;
        },
    },
    'saar': {
        key: 'saar',
        name: 'The Clan of Saar',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 3,
            [ExperienceLevels.beginner]: 4,
            [ExperienceLevels.intermediate]: 5,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 1,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(5);
            //TODO - expansion modifiers
            return score;
        },
    },
    'muaat': {
        key: 'muaat',
        name: 'The Embers of Muuat',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 1,
            [ExperienceLevels.beginner]: 2,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 4,
            [ExperienceLevels.veteran]: 4,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(24);
            //TODO - expansion modifiers
            return score;
        },
        // warsuns + the hero ability, like yes please
        bonusFunness: 2,
    },
    'hacan': {
        key: 'hacan',
        name: 'The Emirates of Hacan',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 5,
            [ExperienceLevels.beginner]: 5,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 1,
            [ExperienceLevels.veteran]: 0,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(6);
            //TODO - expansion modifiers
            return score;
        },
    },
    'sol': {
        key: 'sol',
        name: 'The Federation of Sol',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 4,
            [ExperienceLevels.beginner]: 4,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 2,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(14);
            //TODO - expansion modifiers
            return score;
        },
    },
    'creuss': {
        key: 'creuss',
        name: 'The Ghosts of Creuss',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 2,
            [ExperienceLevels.beginner]: 4,
            [ExperienceLevels.intermediate]: 5,
            [ExperienceLevels.expert]: 4,
            [ExperienceLevels.veteran]: 4,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(20);
            //TODO - expansion modifiers
            return score;
        },
        // the extra movement and hero abilities make them a rally fun early faction
        bonusFunness: 1,
    },
    'l1z1x': {
        key: 'l1z1x',
        name: 'The L1Z1X Mindset',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 4,
            [ExperienceLevels.beginner]: 5,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 1,
            [ExperienceLevels.veteran]: 1,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(16);
            //TODO - expansion modifiers
            return score;
        },
    },
    'mentak': {
        key: 'mentak',
        name: 'The Mentak Coalition',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 0,
            [ExperienceLevels.beginner]: 2,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 5,
            [ExperienceLevels.veteran]: 4,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(17);
            //TODO - expansion modifiers
            return score;
        }
    },
    'naalu': {
        key: 'naalu',
        name: 'The Naalu Collective',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 1,
            [ExperienceLevels.beginner]: 3,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 4,
            [ExperienceLevels.veteran]: 4,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(2);
            //TODO - expansion modifiers
            return score;
        },
    },
    'nekro': {
        key: 'nekro',
        name: 'Nekro Virus',
        complexityWeight: {
            [ExperienceLevels.firstTime]: null,
            [ExperienceLevels.beginner]: 1,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 4,
            [ExperienceLevels.veteran]: 5,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(9);
            //TODO - expansion modifiers
            return score;
        },
        // 4 or less players, having nekro removes entirety of diplomacy in the game, due to 3 onl being for agenda phase
        playerCountModifier: (count) => count <= 4 ? -2 : 0,
    },
    'sardakk': {
        key: 'sardakk',
        name: 'Sardakk N\'orr',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 5,
            [ExperienceLevels.beginner]: 4,
            [ExperienceLevels.intermediate]: 2,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 3,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(21);
            //TODO - expansion modifiers
            return score;
        },
    },
    'jol-nar': {
        key: 'jol-nar',
        name: 'The Universities of Jol-Nar',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 5,
            [ExperienceLevels.beginner]: 5,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 1,
            [ExperienceLevels.veteran]: 1,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(1);
            //TODO - expansion modifiers
            return score;
        },
    },
    'winnu': {
        key: 'winnu',
        name: 'The Winnu',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 0,
            [ExperienceLevels.beginner]: 2,
            [ExperienceLevels.intermediate]: 2,
            [ExperienceLevels.expert]: 4,
            [ExperienceLevels.veteran]: 4,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(22);
            //TODO - expansion modifiers
            return score;
        },
    },
    'xxcha': {
        key: 'xxcha',
        name: 'The Xxcha Kingdom',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 3,
            [ExperienceLevels.beginner]: 5,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 3,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(13);
            //TODO - expansion modifiers
            return score;
        },
        // because a lot of the abilities are agenda phase, just slightly less weight when only 4 players
        playerCountModifier: (count) => count <= 4 ? -1 : 0,
    },
    'yin': {
        key: 'yin',
        name: 'The Yin Brotherhood',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 0,
            [ExperienceLevels.beginner]: 2,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 4,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(23);
            //TODO - expansion modifiers
            return score;
        },
    },
    'yssaril': {
        key: 'yssaril',
        name: 'The Yssaril Tribes',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 3,
            [ExperienceLevels.beginner]: 4,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 2,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(4);
            //TODO - expansion modifiers
            return score;
        },
    },



    // PoK
    'argent': {
        expansion: 'pok',
        key: 'argent',
        name: 'The Argent Flight',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 3,
            [ExperienceLevels.beginner]: 4,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 2,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(15);
            //TODO - expansion modifiers
            return score;
        },
    },
    'empyrean': {
        expansion: 'pok',
        key: 'empyrean',
        name: 'The Empyrean',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 4,
            [ExperienceLevels.beginner]: 5,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 3,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(10);
            //TODO - expansion modifiers
            return score;
        },
        // empyrean really needs to have people to negotiate with
        playerCountModifier: (count) => count <= 5 ? -3 : 1
    },
    'mahact': {
        expansion: 'pok',
        key: 'mahact',
        name: 'The Mahact Gene-Sorcerers',
        complexityWeight: {
            [ExperienceLevels.firstTime]: null,
            [ExperienceLevels.beginner]: 0,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 4,
            [ExperienceLevels.veteran]: 4,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(3);
            //TODO - expansion modifiers
            return score;
        },
        playerCountModifier: (count) => count <= 4 ? -1 : 0
    },
    'naaz-rokha': {
        expansion: 'pok',
        key: 'naaz-rokha',
        name: 'The Naaz-Rokha Alliance',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 4,
            [ExperienceLevels.beginner]: 5,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 3,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(7);
            //TODO - expansion modifiers
            return score;
        },
    },
    'nomad': {
        expansion: 'pok',
        key: 'nomad',
        name: 'The Nomad',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 5,
            [ExperienceLevels.beginner]: 4,
            [ExperienceLevels.intermediate]: 3,
            [ExperienceLevels.expert]: 2,
            [ExperienceLevels.veteran]: 1,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(8);
            //TODO - expansion modifiers
            return score;
        },
    },
    'titans': {
        expansion: 'pok',
        key: 'titans',
        name: 'The Titans of Ul',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 3,
            [ExperienceLevels.beginner]: 4,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 2,
            [ExperienceLevels.veteran]: 2,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(11);
            //TODO - expansion modifiers
            return score;
        },
    },
    'vuilraith': {
        expansion: 'pok',
        key: 'vuilraith',
        name: 'The Vuil\'Raith Cabal',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 2,
            [ExperienceLevels.beginner]: 5,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 3,
            [ExperienceLevels.veteran]: 2,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(19);
            //TODO - expansion modifiers
            return score;
        },
    },



    // codex
    'keleres': {
        expansion: 'codex3',
        'key': 'keleres',
        'name': 'The Council Keleres',
        complexityWeight: {
            [ExperienceLevels.firstTime]: 0,
            [ExperienceLevels.beginner]: 4,
            [ExperienceLevels.intermediate]: 4,
            [ExperienceLevels.expert]: 4,
            [ExperienceLevels.veteran]: 4,
        },
        score: (exps) => {
            let score: ReturnType<Faction['score']> = baseRank(12);
            //TODO - expansion modifiers
            return score;
        },
    }
}

export const FACTION_ARR = Object.keys(FACTION_DETAILS) as FACTIONS[];


export function FACTIONS_FILTERED(expansions: Set<EXPANSION_KEYS>, users: User[]) {
    const all_first_time = users.length && users.every(u => u.experience === ExperienceLevels.firstTime);
    return FACTION_ARR.filter(f => {
        const fac = FACTION_DETAILS[f];
        if(fac.expansion) return expansions.has(fac.expansion);
        if(all_first_time && fac.complexityWeight[ExperienceLevels.firstTime] === null) return false;
        return true;
    });
}


/**
 * Convert rank to a 0-4 score
 * @param base The base rank
 * @returns 
 */
function baseRank(base: number) {
    return Math.floor((FACTION_ARR.length - base) / (FACTION_ARR.length - 1));
}






// ranking from SCPT podcast 278: https://open.spotify.com/episode/4P2HOvUG9khuWy8kyc5cyE
//  1. Jol-Nar
//  2. Naalu
//  3. Mahact
//  4. Yssaril
//  5. Saar
//  6. Hacan
//  7. naaz-rokha
//  8. Nomad
//  9. Nekro
// 10. Empyrean
// 11. Titans
// 12. Keleres
// 13. Xxcha
// 14. Sol
// 15. Argent
// 16. L1Z1X
// 17. Mentak
// 18. Barony
// 19. Cabal
// 20. Ghosts
// 21. sardakk
// 22. winnu
// 23. Yin
// 24. Muuat
// 25. Arborec