import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { NewUserFormSchemaDto } from '../models/new-user-form-schema-dto';
import { PwmRestResult } from '../models/pwm-rest-result';

@Injectable({
  providedIn: 'root'
})
export class NewUserService {

  constructor(
    private http: HttpClient,
  ) { }

  private checkError(result: PwmRestResult<any>): void {
    if (result.error) {
      console.error(`[${result.errorCode}] ${result.errorMessage}` + (result.errorDetail ? ` ${result.errorDetail}` : ''));
      throw new Error(result.errorMessage || 'Error with no message returned from PWM')
    }
  }

  getNewUserFormSchema(newUserProfileId: string): Observable<NewUserFormSchemaDto> {
    newUserProfileId = newUserProfileId.trim();

    const url = `${window.baseUrl}/public/newuser`;
    let params = new HttpParams().set('processAction', 'formSchema');
    if (newUserProfileId) {
      params = params.set('newUserProfileId', newUserProfileId);
    }

    console.groupEnd()
    return this.http.get<PwmRestResult<NewUserFormSchemaDto>>(url, { params }).pipe(
      tap(x => this.checkError(x)),
      map(x => x.data!)
    );
  }

  sendEmailOtp(email: string): Observable<{ token: string }> {
    email = email.trim();

    const url = `${window.baseUrl}/public/newuser`;
    const params = new HttpParams().set('processAction', 'sendOTP');
    const payload = { email };

    return this.http.post<PwmRestResult<{ token: string}>>(url, payload, { params }).pipe(
      tap(x => this.checkError(x)),
      map(x => x.data!)
    );
  }

  verifyOtp(otp: string, token: string): Observable<{ token: string }> {
    otp = otp.trim();
    token = token.trim();

    const url = `${window.baseUrl}/public/newuser`;
    const params = new HttpParams().set('processAction', 'verifyOTP');
    const payload = { otp, token };

    return this.http.post<PwmRestResult<{ token: string }>>(url, payload, { params }).pipe(
      tap(x => this.checkError(x)),
      map(x => x.data!)
    )
  }

  createUser(userData: any): Observable<any> {
    const url = `${window.baseUrl}/public/newuser`;
    const params = new HttpParams().set('processAction', 'spaCreateNewUser');

    return this.http.post<PwmRestResult<any>>(url, userData, { params }).pipe(
      tap(x => this.checkError(x))
    )
  }
}
