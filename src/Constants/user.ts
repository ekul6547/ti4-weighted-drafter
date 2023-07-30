export enum ExperienceLevels {
    firstTime,
    beginner,
    intermediate,
    expert,
    veteran,
};



export interface User {
    id: number;
    name: string;
    experience: ExperienceLevels;
}


export const ExperienceToText: Record<ExperienceLevels, string> = {
    [ExperienceLevels.firstTime]: "First Time",
    [ExperienceLevels.beginner]: "Beginner",
    [ExperienceLevels.intermediate]: "Intermediate",
    [ExperienceLevels.expert]: "Expert",
    [ExperienceLevels.veteran]: "Veteran",
}