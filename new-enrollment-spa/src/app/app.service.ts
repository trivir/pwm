import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

export interface PwmResponse<T> {
    error: boolean,
    errorCode: number,
    data: T
}

@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor(private http: HttpClient) { }

    sendOtp(body: { email: string }): Observable<PwmResponse<{ token: string }>> {
        const url = '/pwm/public/newuser?processAction=sendOTP';

        return this.http.post<PwmResponse<{ token: string }>>(url, body);
    }

    verifyOtp(body: { token: string, otp: string }): Observable<PwmResponse<{ token: string }>> {
        const url = '/pwm/public/newuser?processAction=verifyOTP';

        this.http.post<any>(url, body);
        return this.http.post<PwmResponse<{ token: string }>>(url, body);
    }

    createUser(formData: any): Observable<any> {
        const url = '/pwm/public/newuser?processAction=spaNewUser';

        return this.http.post<any>(url, formData);
    }
}
