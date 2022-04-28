import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
    providedIn: 'root'
})
export class NotificationCenterService {

    constructor(private snackBar: MatSnackBar) { }

    displayMessage(message: string) {
        this.snackBar.open(message, 'Dismiss', {
            duration: 5000,
            verticalPosition: "top"
        });
    }
}
