import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, Observable, timer } from 'rxjs';
import { DynamicFormService } from '../dynamic-form.service';
import { FormConfig } from '../models/form-config';
import { VerificationMethod } from '../models/new-user-form-schema-dto';
import { NotificationsService } from '../notifications.service';
import { NewUserService } from './new-user.service';

type FormState =
  | 'input'
  | 'verify'

@Component({
  selector: 'app-new-user-form',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit {

  formState: FormState = 'input';
  isLargeScreen: Observable<boolean>;

  // User info form
  infoForm: FormGroup = new FormGroup({});
  formConfigs: FormConfig[] = [];
  promptForPassword = false;
  passwordRules: string[] = [];
  userAgreementText = '';
  privacyPolicyText = '';

  // Verification form
  verifyForm: FormGroup = new FormGroup({});
  needVerificationFields: string[] = [];
  fieldsToVerify: Record<string, VerificationMethod> = {};

  redirectUrl = '';

  constructor(
    private service: NewUserService,
    private notifications: NotificationsService,
    private formService: DynamicFormService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.isLargeScreen = breakpointObserver
      .observe('(min-width: 600px)')
      .pipe(map(x => x.matches));
  }

  ngOnInit(): void {
    this.breakpointObserver
      .observe('(min-width: 600px)')
      .pipe(map(x => x.matches));

    this.service.getNewUserFormSchema('default').subscribe({
      next: x => {
        // Normal fields
        this.infoForm = this.formService.toFormGroup(x.fieldConfigs);
        this.formConfigs = x.fieldConfigs;

        // Password fields
        if (x.promptForPassword) {
          this.infoForm.addControl('password1', new FormControl('', Validators.required))
          this.infoForm.addControl('password2', new FormControl('', Validators.required))
          this.promptForPassword = x.promptForPassword;
          this.passwordRules = x.passwordRules;
        }

        if (x.userAgreement !== '') {
          this.infoForm.addControl('userAgreementOpened', new FormControl(false, Validators.requiredTrue))
          this.infoForm.addControl('userAgreementAgreed', new FormControl({ value: false, disabled: true }, Validators.requiredTrue))
          this.userAgreementText = x.userAgreement;
        }

        if (x.userPrivacyAgreement) {
          this.infoForm.addControl('privacyPolicyOpened', new FormControl(false, Validators.requiredTrue))
          this.infoForm.addControl('privacyPolicyAgreed', new FormControl({ value: false, disabled: true }, Validators.requiredTrue))
          this.privacyPolicyText = x.userPrivacyAgreement;
        }

        if (x.redirectUrl) {
          this.redirectUrl = x.redirectUrl;
        }

        this.fieldsToVerify = x.fieldsForVerification;
      },
      error: e => this.notifications.push(e.messsage)
    })
  }

  onOpenUserAgreement(): void {
    this.infoForm.get('userAgreementOpened')?.setValue(true);
    this.infoForm.get('userAgreementAgreed')?.enable();
  }

  onOpenPrivacyPolicy(): void {
    this.infoForm.get('privacyPolicyOpened')?.setValue(true);
    this.infoForm.get('privacyPolicyAgreed')?.enable();
  }

  coninueToVerify(): void {
    this.infoForm.markAllAsTouched();
    if (this.infoForm.invalid) {
      return;
    }

    this.needVerificationFields = Object.keys(this.fieldsToVerify)
      .filter(field => this.infoForm.get(field)?.value !== '');

    for (const field of this.needVerificationFields) {
      // If not in verify form, add it
      if (!this.verifyForm.contains(`${field}Val`)) {
        this.verifyForm.addControl(`${field}Val`, new FormControl(this.infoForm.get(field)!.value));
        this.verifyForm.addControl(`${field}OtpSent`, new FormControl(false))
        this.verifyForm.addControl(`${field}Otp`, new FormControl(''))
        this.verifyForm.addControl(`${field}OtpDisabled`, new FormControl(false))
        this.verifyForm.addControl(`${field}OtpVerified`, new FormControl(false, Validators.requiredTrue))
        this.verifyForm.addControl(`${field}Token`, new FormControl('', Validators.required))
        continue;
      }

      // If the value has changed, reset the values
      if (this.verifyForm.get(`${field}Val`)!.value !== this.infoForm.get(field)!.value) {
        this.verifyForm.get(`${field}Val`)!.setValue(this.infoForm.get(field)!.value);
        this.verifyForm.get(`${field}OtpSent`)!.reset(false);
        this.verifyForm.get(`${field}Otp`)!.reset('');
        this.verifyForm.get(`${field}OtpDisabled`)!.reset(false);
        this.verifyForm.get(`${field}OtpVerified`)!.reset(false);
        this.verifyForm.get(`${field}Token`)!.reset('');
      }
    }

    this.formState = 'verify';
  }

  sendOtp(field: string): void {
    field = field.trim();

    const method: VerificationMethod = this.fieldsToVerify[field];
    if (!method) {
      console.error('Field sent to sendOtp method had no VerificationMethod in fieldsToVerify')
      this.notifications.push('Error sending OTP code')
      return;
    }

    const fieldVal = this.verifyForm.get(`${field}Val`)?.value.trim();

    this.verifyForm.get(`${field}OtpDisabled`)!.setValue(true);
    timer(10_000).subscribe(_ => this.verifyForm.get(`${field}OtpDisabled`)!.setValue(false))

    switch (method) {
      case 'email':
        this.service.sendEmailOtp(fieldVal).subscribe({
          next: x => {
            this.verifyForm.get(`${field}Token`)!.setValue(x.token)
            this.verifyForm.get(`${field}OtpSent`)!.setValue(true)
            this.notifications.push('OTP sent, please check your email')
          },
          error: e => {
            this.notifications.push(e.message)
          }
        });
        break;
      case 'sms':
        this.notifications.push('Sending OTP codes to SMS is not supported yet')
        break;
    }
  }

  verifyOtp(field: string): void {
    field = field.trim();

    const fieldOtp = this.verifyForm.get(`${field}Otp`)?.value.trim();
    const fieldToken = this.verifyForm.get(`${field}Token`)?.value.trim();

    this.service.verifyOtp(fieldOtp, fieldToken).subscribe({
      next: x => {
        this.verifyForm.get(`${field}Token`)!.setValue(x.token)
        this.verifyForm.get(`${field}OtpVerified`)!.setValue(true)
      },
      error: e => this.notifications.push(e.message)
    })
  }

  onSubmit(): void {
    let userData = this.infoForm.value;
    for (const [key, value] of Object.entries(this.verifyForm.value)) {
      if (key.endsWith('Token')) {
        userData[key] = value
      }
    }

    this.service.createUser(userData).subscribe({
      next: x => window.location.href = this.redirectUrl ? this.redirectUrl : window.baseUrl,
      error: e => this.notifications.push(e.message)
    })
  }
}
