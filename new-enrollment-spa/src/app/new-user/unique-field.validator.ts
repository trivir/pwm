import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { catchError, delay, map, Observable, of, switchMap } from 'rxjs';
import { NewUserService } from './new-user.service';

function getControlName(c: AbstractControl): string | null {
  const formGroup = c.parent?.controls;
  if (!formGroup) {
    return null;
  }
  return Object.keys(formGroup).find(name => (formGroup as { [key: string]: AbstractControl })[name] === c) || null
}

@Injectable({ providedIn: 'root'})
export class UniqueFieldValidator implements AsyncValidator {
  constructor (private newUserService: NewUserService) { }

  validate = (control: AbstractControl): Observable<ValidationErrors | null> => {
    const controlName = getControlName(control) || '';
    const field: Record<string, string> = {};
    field[controlName] = control.value;
    return of(field).pipe(
      delay(250),
      switchMap(field => this.newUserService.checkUnique(field).pipe(
        map(isUnique => isUnique ? null : { notUnique : true }),
        catchError(err => of({ error: err }))
      ))
    );
  }
}
