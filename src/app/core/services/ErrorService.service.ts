/**
 * ErrorService
 *
 * @Description This service is responsible for handling and storing routing errors within the application.
 * It provides methods to set error information and to retrieve it.
 * It can also generate windows alerts to display error information to the user.
 *
 * @author Jérémy Mulet
 * @since 2023-08-03
 */
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ErrorService {
    private notFoundErrorMessage: string = "";
    getNotFoundErrorMessage(): string{
        return this.notFoundErrorMessage;
    }

    setNotFoundErrorMessage(errorMessage: string) {
        this.notFoundErrorMessage = errorMessage;
    }

}
