import {Component, Input, OnInit} from '@angular/core';
import {ErrorService} from "../../core/services/ErrorService.service";

@Component({
    selector: 'app-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
    errorMessage: string  =  "";
    constructor(private errorService: ErrorService) { }

    ngOnInit(): void {
        this.errorMessage = this.errorService.getNotFoundErrorMessage();
        this.errorService.setNotFoundErrorMessage("");
    }

}
