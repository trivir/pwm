import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface PwmRestResult<T> {
    data?: T
    error: boolean
    errorCode: number
    errorMessage?: string
    errorDetail?: string
    successMessage?: string
}

@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor(private http: HttpClient) { }

    private static checkPwmError(pwmResponse: PwmRestResult<any>): void {
        if (pwmResponse.error) {
            const message = `[${pwmResponse.errorCode}] ${pwmResponse.errorMessage}` + (pwmResponse.errorDetail ? ` (${pwmResponse.errorDetail})` : '')
            throw new Error(message);
        }
    }

    sendOtp(body: { email: string }): Observable<PwmRestResult<{ token: string }>> {
        const url = '/pwm/public/newuser?processAction=sendOTP';

        return this.http.post<PwmRestResult<{ token: string }>>(url, body).pipe(
            tap(x => AppService.checkPwmError(x))
        );
    }

    verifyOtp(body: { token: string, otp: string }): Observable<PwmRestResult<{ token: string }>> {
        const url = '/pwm/public/newuser?processAction=verifyOTP';

        this.http.post<any>(url, body);
        return this.http.post<PwmRestResult<{ token: string }>>(url, body).pipe(
            tap(x => AppService.checkPwmError(x))
        );
    }

    createUser(formData: any): Observable<any> {
        const url = '/pwm/public/newuser?processAction=spaNewUser';

        return this.http.post<PwmRestResult<any>>(url, formData).pipe(
            tap(x => AppService.checkPwmError(x))
        );
    }
}
