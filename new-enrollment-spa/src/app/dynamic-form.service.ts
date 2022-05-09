import { Injectable } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatchingValidator } from './matching.validator';
import { FormConfig } from './models/form-config';
import { UniqueFieldValidator } from './new-user/unique-field.validator'

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor(private uniqueValidator: UniqueFieldValidator) { }

  private determineSyncValidators(formConfig: FormConfig): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (formConfig.required) {
      validators.push(Validators.required);
    }
    validators.push(Validators.minLength(formConfig.minimumLength));
    validators.push(Validators.maxLength(formConfig.maximumLength));
    if (formConfig.regex) {
      validators.push(Validators.pattern(formConfig.regex))
    }

    return validators;
  }

  private determineAsyncValidators(formConfig: FormConfig): AsyncValidatorFn[] {
    const asyncValidators: AsyncValidatorFn[] = [];

    if (formConfig.unique) {
      asyncValidators.push(this.uniqueValidator.validate)
    }

    return asyncValidators;
  }

  private mapFormConfigToFormControl(formConfig: FormConfig): FormControl {
    return new FormControl('', this.determineSyncValidators(formConfig), this.determineAsyncValidators(formConfig))
  }

  toFormGroup(formConfigs: FormConfig[]): FormGroup {
    if (formConfigs === null) {
      return new FormGroup({});
    }
    const group: any = {};

    formConfigs.forEach(formConfig => {
      group[formConfig.name] = this.mapFormConfigToFormControl(formConfig);
      if (formConfig.confirmationRequired) {
        const syncValidator = formConfig.required ? Validators.required : [];
        group[formConfig.name + '_confirm'] = new FormControl('', syncValidator, MatchingValidator(formConfig.name))
      }
    })

    return new FormGroup(group);
  }
}
