/**
 *  @description Represents one participation to olympics games
 *
 *  @author Jérémy Mulet
 */
export interface Participation {
    id: number;
    year: number;
    city: string;
    medalsCount: number;
    athleteCount: number;
}
