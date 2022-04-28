import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from './app.service';
import { MatchingValidator } from './matching-validator';
import { DOCUMENT } from "@angular/common";
import { NotificationCenterService } from "./notification-center.service";

export type FormState =
    | 'EMAIL'
    | 'OTP'
    | 'PROFILE'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    window: Window | null;

    form = this.formBuilder.group({
        mail: ['', [Validators.required, Validators.email]],
        otp: ['', Validators.required],
        token: ['', Validators.required],
        givenName: ['', Validators.required],
        sn: ['', Validators.required],
        password1: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/)]],
        password2: ['', Validators.required],
        agreementOpened: [false, Validators.requiredTrue],
        agreement: [{ value: false, disabled: true }, Validators.requiredTrue],
        privacyPolicyOpened: [false, Validators.requiredTrue],
        privacyPolicy: [{ value: false, disabled: true }, Validators.requiredTrue],
        nokiaPersonReferralURL: [null]
    }, {
        validators: MatchingValidator('password', 'confirmPassword')
    });

    formState: FormState = 'EMAIL';
    numWaiting = 0;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private formBuilder: FormBuilder,
        private appService: AppService,
        private notifyService: NotificationCenterService,
        public dialog: MatDialog
    ) {
        this.window = this.document.defaultView;
    }

    onBack(): void {
        this.form.get('otp')?.reset();
        this.form.get('token')?.reset();
        this.formState = 'EMAIL';
    }

    onSendOtp(): void {
        if (this.form.get('mail')!.invalid) {
            this.form.get('mail')!.markAsTouched();
            return;
        }
        this.form.get('otp')!.reset('');
        this.form.get('token')!.reset('');
        this.appService.sendOtp({ email: this.form.get('mail')!.value }).subscribe({
            next: response => this.otpSent(response.data!.token),
            error: error => console.error('Error sending otp ' + error)
        });
        this.numWaiting++;
    }

    private otpSent(token: string): void {
        this.form.get('token')!.setValue(token);
        this.numWaiting--;
        this.formState = 'OTP';
        this.notifyService.displayMessage("OTP code sent, please check your email")
    }

    onVerifyOtp(): void {
        if (this.form.get('otp')!.invalid) {
            this.form.get('otp')!.markAsTouched();
            return;
        }
        this.appService.verifyOtp({ otp: this.form.get('otp')!.value, token: this.form.get('token')!.value }).subscribe({
            next: response => {
                if (response.error) {
                    this.form.get('otp')!.setErrors({ invalid: true });
                }
                this.otpValid(response.data!.token);
            },
            error: error => console.error('Error validating otp ' + error)
        });
        this.numWaiting++;
    }

    private otpValid(token: string): void {
        this.form.get('token')!.setValue(token);
        this.form.get('otp')!.setErrors(null);
        this.numWaiting--;
        this.formState = 'PROFILE';
    }

    onSubmitForm() {
        console.log('form submitted');
        if (this.form.invalid) {
            this.form.get('agreement')?.markAsTouched();
            return;
        }
        const cookieName = 'referer';
        const cookieValue = document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)')?.pop() || null;
        this.form.get('nokiaPersonReferralURL')!.setValue(cookieValue);
        this.appService.createUser(this.form.value).subscribe({
            next: () => this.redirectToLogin(),
            error: (e) => {
                this.numWaiting--;
                console.log(e);
                this.notifyService.displayMessage('Failed to create user: ' + e.message)
            }
        });
        this.numWaiting++;
    }

    private redirectToLogin() {
        this.numWaiting--;
        let url = this.form.get('nokiaPersonReferralURL')?.value || 'default';
        if (!Object.keys(window.redirectTable).includes(url)) {
            url = 'default'
        }
        const redirectUrl = window.redirectTable[url];
        window.location.href = redirectUrl;
    }

    openAgreement(): void {
        if (!this.form.get('agreementOpened')?.value) {
            this.form.get('agreementOpened')?.setValue(true);
        }
        this.form.get('agreement')?.enable();
        this.window?.open(this.window?.agreementUrl, '_blank');
    }

    openPrivacyPolicy(): void {
        if (!this.form.get('privacyPolicyOpened')?.value) {
            this.form.get('privacyPolicyOpened')?.setValue(true);
        }
        this.form.get('privacyPolicy')?.enable();
        this.window?.open(this.window?.privacyPolicyUrl, '_blank');
    }
}
