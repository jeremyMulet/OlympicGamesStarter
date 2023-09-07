import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Olympic} from '../models/Olympic';

/**
 * OlympicService
 *
 * @Description This service encapsulates methods and behaviors associated with Olympic data.
 * It maintains a BehaviorSubject to store and emit the current state of Olympic data for other
 * components/services to consume.
 *
 * @author Jérémy Mulet
 */

@Injectable({
    providedIn: 'root',
})
export class OlympicService {
    private olympicUrl: string = './assets/mock/olympic.json';
    private olympics$ = new BehaviorSubject<Olympic[]>([]);

    constructor(private http: HttpClient) {}

    loadInitialData(): Observable<Olympic[]> {
        return this.http.get<Olympic[]>(this.olympicUrl).pipe(
            tap((value) => this.olympics$.next(value)),
            catchError((error, caught) => {
                console.error(error);
                return caught;
            })
        );
    }

    getOlympics(): Observable<Olympic[]> {
        return this.olympics$.asObservable();
    }

    getOlympicById(coutryName: string | null): Observable<Olympic | undefined> {
        return this.olympics$.pipe(
            map(value =>
                value.find(olympic => olympic.country === coutryName)
            )
        )
    }

    getTotalMedalsForACountry(olympicCountry: Olympic): number {
        return olympicCountry.participations.reduce(
            (sum, participation) => sum + participation.medalsCount, 0
        );
    }
}
