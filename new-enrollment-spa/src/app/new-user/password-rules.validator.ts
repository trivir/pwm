import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, delay, map, Observable, of, switchMap } from 'rxjs';
import { NewUserService } from './new-user.service';

@Injectable({ providedIn: 'root'})
export class PasswordRulesValidator implements AsyncValidator {
  constructor (private newUserService: NewUserService) { }

  validate = (control: AbstractControl): Observable<ValidationErrors | null> => {
    return of(control.parent).pipe(
      delay(250),
      switchMap(form => this.newUserService.checkRules(form?.value).pipe(
        map(result => result.passed ? null : { passwordRules : result.message }),
        catchError(err => of({ error: err }))
      ))
    );
  }
}
