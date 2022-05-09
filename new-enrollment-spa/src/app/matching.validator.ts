import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { delay, Observable, of, switchMap } from 'rxjs';

export function MatchingValidator(controlToMatchName: string): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {

    return of(control).pipe(
      delay(250),
      switchMap(ctl => {
        const controlToMatch = ctl.parent?.get(controlToMatchName);
        if (ctl.value === '' || ctl?.errors && !ctl.hasError('mismatch')) {
          return of(null);
        }

        if (ctl?.value !== controlToMatch?.value) {
          return of({ mismatch: true })
        }

        return of(null);
      })
    )
  };
}
