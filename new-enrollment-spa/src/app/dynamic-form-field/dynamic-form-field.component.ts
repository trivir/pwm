import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LocalePipe } from '../locale.pipe';
import { FormConfig } from '../models/form-config';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.scss']
})
export class DynamicFormFieldComponent {

  @Input() formConfig!: FormConfig;
  @Input() form!: FormGroup;

  constructor(private localePipe: LocalePipe) { }

  get isValid() {
    return this.form.controls[this.formConfig.name].valid
  }

  get errorMessage() {
    if (this.isValid) {
      return ''
    }

    const control = this.form.get(this.formConfig.name);

    if (control?.errors?.['required']) {
      return this.localePipe.transform(this.formConfig.labels) + ' is required';
    }

    if (control?.errors?.['pattern']) {
      return this.localePipe.transform(this.formConfig.regexErrors)
    }

    if (control?.errors?.['minlength']) {
      return this.localePipe.transform(this.formConfig.labels) + ' is too short';
    }

    if (control?.errors?.['maxlength']) {
      return this.localePipe.transform(this.formConfig.labels) + ' is too long';
    }

    return 'Unknown error';
  }
}
