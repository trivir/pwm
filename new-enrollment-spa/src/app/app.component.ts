import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from './app.service';
import { MatchingValidator } from './matching-validator';
import { UserAgreementDialogComponent } from './user-agreement-dialog/user-agreement-dialog.component';

export enum FormState {
    EMAIL,
    OTP,
    PROFILE
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    readonly FormState = FormState;
    readonly PASSWORD_RULES = [
        'Minimum 8 characters',
        'At least 1 uppercase letter',
        'At least 1 lowercase letter',
        'At least 1 number',
        'At least 1 special character - (@$!%*?&#)'
    ];

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
        nokiaPersonReferralURL: [null]
    }, {
        validators: MatchingValidator('password', 'confirmPassword')
    });

    formState = FormState.EMAIL;
    numWaiting = 0;

    constructor(
        private formBuilder: FormBuilder,
        private service: AppService,
        public dialog: MatDialog
    ) { }

    onBack(): void {
        this.form.get('otp')?.reset();
        this.form.get('token')?.reset();
        this.formState = FormState.EMAIL;
    }

    onSendOtp(): void {
        if (this.form.get('mail')!.invalid) {
            this.form.get('mail')!.markAsTouched();
            return;
        }
        this.form.get('otp')!.reset('');
        this.form.get('token')!.reset('');
        this.service.sendOtp({ email: this.form.get('mail')!.value }).subscribe({
            next: response => this.otpSent(response.data.token),
            error: error => console.error('Error sending otp ' + error)
        });
        this.numWaiting++;
    }

    private otpSent(token: string): void {
        this.form.get('token')!.setValue(token);
        this.numWaiting--;
        this.formState = FormState.OTP;
    }

    onVerifyOtp(): void {
        if (this.form.get('otp')!.invalid) {
            this.form.get('otp')!.markAsTouched();
            return;
        }
        this.service.verifyOtp({ otp: this.form.get('otp')!.value, token: this.form.get('token')!.value }).subscribe({
            next: response => {
                if (response.error) {
                    this.form.get('otp')!.setErrors({ invalid: true });
                }
                this.otpValid(response.data.token);
            },
            error: error => console.error('Error validating otp ' + error)
        });
        this.numWaiting++;
    }

    private otpValid(token: string): void {
        this.form.get('token')!.setValue(token);
        this.form.get('otp')!.setErrors(null);
        this.numWaiting--;
        this.formState = FormState.PROFILE;
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
        this.service.createUser(this.form.value).subscribe(() => this.redirectToLogin());
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

    openAgreementDialog(): void {
        if (!this.form.get('agreementOpened')?.value) {
            this.form.get('agreementOpened')?.setValue(true);
        }
        const dialogRef = this.dialog.open(UserAgreementDialogComponent);
        this.form.get('agreement')?.enable();
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.form.get('agreement')?.setValue(result);
            }
        });
    }
}
