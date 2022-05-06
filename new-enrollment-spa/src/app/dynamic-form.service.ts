import { Injectable } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { FormConfig } from './models/form-config';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor() { }

  private determineSyncValidators(formConfig: FormConfig): ValidatorFn[] {
    const validators = [];

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

  private mapFormConfigToFormControl(formConfig: FormConfig): FormControl {
    return new FormControl('', this.determineSyncValidators(formConfig))
  }

  toFormGroup(formConfigs: FormConfig[]): FormGroup {
    if (formConfigs === null) {
      return new FormGroup({});
    }
    const group: any = {};

    formConfigs.forEach(formConfig => {
      group[formConfig.name] = this.mapFormConfigToFormControl(formConfig);
    })

    return new FormGroup(group);
  }
}
