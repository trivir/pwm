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
  @Input() isPrimaryEmail: boolean = false;

  constructor(private localePipe: LocalePipe) { }

  get isValid() {
    return this.form.controls[this.formConfig.name].valid
  }

  get errorMessage() {
    if (this.isValid) {
      return ''
    }

    const control = this.form.get(this.formConfig.name);

    if (control?.hasError('required')) {
      return this.localePipe.transform(this.formConfig.labels) + ' is required';
    }

    if (control?.hasError('pattern')) {
      return this.localePipe.transform(this.formConfig.regexErrors)
    }

    if (control?.hasError('minlength')) {
      return this.localePipe.transform(this.formConfig.labels) + ' is too short';
    }

    if (control?.hasError('maxlength')) {
      return this.localePipe.transform(this.formConfig.labels) + ' is too long';
    }

    if (control?.hasError('notUnique')) {
      return this.localePipe.transform(this.formConfig.labels) + ' is already in use, please use a different value';
    }

    if (control?.hasError('mismatch')) {
      return 'Does not match'
    }

    return 'Unknown error';
  }
}
