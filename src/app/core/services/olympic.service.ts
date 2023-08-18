import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {Olympic} from '../models/Olympic';
import {LocalStorageService} from "./local-storage.service";

/**
 * OlympicService
 *
 * @description This service encapsulates methods and behaviors associated with Olympic data.
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

    constructor(private http: HttpClient, private localStorage: LocalStorageService) {
        this.setOlympicsWithLocalStorage();
    }

    loadInitialData(): Observable<Olympic[]> {
        return this.http.get<Olympic[]>(this.olympicUrl).pipe(tap((value) => {
            this.olympics$.next(value);
            this.localStorage.setItem("olympics",value);
        }), catchError((error, caught) => {
            console.error(error);
            this.setOlympicsWithLocalStorage();
            return caught;
        }));
    }

    getOlympics(): Observable<Olympic[]> {
        return this.olympics$.asObservable();
    }

    getOlympicByCountryName(name: string | null): Olympic | undefined {
        return this.olympics$.getValue().find(olympic => olympic.country === name);
    }

    getNumberOfCountries(): number {
        return this.olympics$.getValue().length;
    }

    /**
     *  @return the number of different date of JO referenced on all the data
     */
    getNumberOfJOs(): number {
        let total: number[] = [];
        let olympics = this.olympics$.getValue();

        olympics.forEach(olympic => {
            olympic.participations.forEach(participation => {
                if (!total.includes(participation.year)) {
                    total.push(participation.year);
                }
            })
        });

        return total.length;
    }

    setOlympicsWithLocalStorage(): void {
        if (this.localStorage.getItem<Olympic[]>("olympics") !== null) {
            this.olympics$.next(this.localStorage.getItem("olympics")!);
        } else {
            this.olympics$.next([]);
        }
    }

    getTotalMedalsForACountry(olympicCountry: Olympic): number {
        let totalMedals = 0;

        olympicCountry.participations.forEach(participation => {
            totalMedals += participation.medalsCount;
        });

        return totalMedals;
    }

    getTotalAthletesForACountry(olympicCountry: Olympic): number {
        let totalAthletes = 0;

        olympicCountry.participations.forEach(participation => {
            totalAthletes += participation.athleteCount;
        });

        return totalAthletes;
    }
}
