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
  private olympics$ = new BehaviorSubject<Olympic>({id:0, country:'', participations:[]});

  constructor(private http: HttpClient,
              private alertService: AlertService) {}

  loadInitialData() {
    console.log('on load initial data');
    return this.http.get<Olympic>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        this.alertService.showError('Une erreur est survenue lors du chargement des données des Jeux Olympiques.');
        this.olympics$.next({id:0, country:'', participations:[]});
        return caught;
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getNumberOfOlympics() {
    this.olympics$.forEach
  }
}
