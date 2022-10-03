export interface PlayerData {
    name: string;
    fame: number;
    exaltations: number;
    rank: number;
    guild?: string;
    guild_rank?: string;
    character_count: number;
    description?: string[];

    // TO-DO
    name_history?: string[];
}