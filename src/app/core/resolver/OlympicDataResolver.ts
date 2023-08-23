import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Olympic} from "../models/Olympic";
import {OlympicService} from "../services/olympic.service";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class OlympicDataResolver implements Resolve<Olympic[]> {
    constructor(private olympicService: OlympicService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Olympic[]> {
        return this.olympicService.loadInitialData();
    }
}
