import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorService} from "../../core/services/ErrorService.service";
import {NavigationStart, Router} from "@angular/router";
import { Location } from '@angular/common';
import {Subscription} from "rxjs";

/**
 * NotFound Component
 *
 * @Description:
 * The NotFound component serves as a fallback view presented to the user when a
 * specific route or data doesn't match any of the predefined routes or when certain
 * expected data is not available.
 *
 * @Features:
 * - Displays a user-friendly message indicating the nature of the error.
 * - Adaptable error messaging:
 *   - For non-existent routes: "No corresponding page found"
 *   - For data not available: "We cannot found information for the chosen country"
 *
 * @author Jérémy Mulet
 */

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, OnDestroy {

    private routerSubscription!: Subscription;
    errorMessage: string  =  "";
    constructor(private errorService: ErrorService, private router: Router, private location: Location) { }

    ngOnInit(): void {
        this.errorMessage = this.errorService.getNotFoundErrorMessage();
        this.errorService.setNotFoundErrorMessage("");

       this.routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (event.navigationTrigger === 'popstate') {
                    history.go(-2);
                }
            }
        });
    }

    onClickBackBtn() {
        history.go(-2);
    }

    ngOnDestroy(): void {
        this.routerSubscription.unsubscribe();
    }

}
