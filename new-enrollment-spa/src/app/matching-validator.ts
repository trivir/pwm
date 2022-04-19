import { AbstractControl, ValidationErrors } from '@angular/forms';

export function MatchingValidator(controlName: string, matchingControlName: string) {
    return (formGroup: AbstractControl): ValidationErrors | null => {
        const control = formGroup.get(controlName);
        const matchingControl = formGroup.get(matchingControlName);
        if (matchingControl?.errors && !matchingControl.errors['mismatch']) {
            return null;
        }

        if (control?.value !== matchingControl?.value) {
            matchingControl?.setErrors({ mismatch: true });
        } else {
            matchingControl?.setErrors(null);
        }
        return null;
    };
}
