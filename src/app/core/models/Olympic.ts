/**
 *  @description Represents country stats on olympics games participation's
 *
 *  @author Jérémy Mulet
 */
import {Participation} from "./Participation";

export interface Olympic {
    id: number;
    country: string;
    participations: Participation[];
}
