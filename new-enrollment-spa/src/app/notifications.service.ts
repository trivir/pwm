import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private _snackBar: MatSnackBar) { }

  push(messsage: string, actionLabel?: string) {
    this._snackBar.open(messsage, actionLabel || 'Dismiss', {
      verticalPosition: 'top',
      duration: 5000
    })
  }
}
