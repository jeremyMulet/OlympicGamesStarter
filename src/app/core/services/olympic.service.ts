import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { AlertService } from './AlertService.service';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl: string = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);


  constructor(private http: HttpClient,
              private alertService: AlertService) {}

  loadInitialData():Observable <Olympic[]>  {

    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
      }),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        this.olympics$.next([]);
        return caught;
      })
    );
  }

  getOlympics():Observable <Olympic[]>  {
    return this.olympics$.asObservable();
  }

  getOlympicsByName(name: string | null): Olympic | null {
    const olympic = this.olympics$.getValue().find(olympic => olympic.country === name);
    return olympic || null;
  }

  getNumberOfCountries(): number {
    return this.olympics$.getValue().length;
  }

  getNumberOfJOs(): number {
    let total: number[] = [];
    let olympics = this.olympics$.getValue();
    olympics.forEach( olympic => {
      olympic.participations.forEach( participation => {
        if(!total.includes(participation.year)) {
          total.push(participation.year);
        }
      })
    });
    return total.length;
  }

  getTotalMedalsCountry(olympicCountry: Olympic): number {
    let totalMedals = 0;
    olympicCountry.participations.forEach( participation => {
      totalMedals += participation.medalsCount;
    });
    return totalMedals;
  }

  getTotalAthletesForCountry(olympicCountry: Olympic): number {
    let totalAthletes = 0;
    olympicCountry.participations.forEach( participation => {
      totalAthletes += participation.athleteCount;
    });
    return totalAthletes;
  }
}
