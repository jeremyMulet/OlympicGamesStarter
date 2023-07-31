import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';
import { AlertService } from './AlertService.service';  

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);


  constructor(private http: HttpClient,
              private alertService: AlertService) {}

  loadInitialData() {
    console.log('on load initial data');
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

  getOlympics() {
    return this.olympics$.asObservable();
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

  getPieChartDatas(): any {
    let series: { data: { name: string; y: number; }[]; type: string; }[] = [];
    const datas: { name: string; y: number; }[] = [];
    this.olympics$.getValue().forEach( olympic => {
      datas.push({name:olympic.country, y:this.getTotalMedalsCountry(olympic)})
    });
    series.push({data: datas, type:'pie' });
    return series;
  }

  getTotalMedalsCountry(olympicCountry: Olympic): number {
    let totalMedals = 0;
    olympicCountry.participations.forEach( participation => {
      totalMedals += participation.medalsCount;
    });
    return totalMedals;
  }

}
