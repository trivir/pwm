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

  getNewUserFormSchema(): Observable<NewUserFormSchemaDto> {
    const url = `${window.baseUrl}/public/newuser`;
    let params = new HttpParams().set('processAction', 'formSchema')
      .set('newUserProfileId', window.newUserProfileId);

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
    const params = new HttpParams().set('processAction', 'verifyOTP')
      .set('newUserProfileId', window.newUserProfileId);
    const payload = { otp, token };

    return this.http.post<PwmRestResult<{ token: string }>>(url, payload, { params }).pipe(
      tap(x => {
        if (x.error && x.errorCode === 5037) {
          x.data = { token: '' };
          return x
        } else if (x.error && x.errorCode === 5041) {
          x.data = { token: 'expired'};
          return x
        }
        return this.checkError(x)
      }),
      map(x => x.data!)
    )
  }

  checkUnique( fieldData: Record<string, string>): Observable<boolean> {
    const url = `${window.baseUrl}/public/newuser`;
    const params = new HttpParams().set('processAction', 'checkUnique')
      .set('newUserProfileId', window.newUserProfileId);


    return this.http.post<PwmRestResult<boolean>>(url, fieldData, { params }).pipe(
      tap(x => this.checkError(x)),
      map(x => x.data!)
    )
  }

  checkRules( fieldData: Record<string, string>): Observable<{ passed: boolean, message: string }> {
    const url = `${window.baseUrl}/public/newuser`;
    const params = new HttpParams().set('processAction', 'checkRules')
      .set('newUserProfileId', window.newUserProfileId);

    return this.http.post<PwmRestResult<{ passed: boolean, message: string }>>(url, fieldData, { params }).pipe(
      tap(x => this.checkError(x)),
      map(x => x.data!)
    )
  }

  createUser(userData: any): Observable<string> {
    const url = `${window.baseUrl}/public/newuser`;
    const params = new HttpParams().set('processAction', 'spaCreateNewUser')
      .set('newUserProfileId', window.newUserProfileId);

    return this.http.post<PwmRestResult<string>>(url, userData, { params }).pipe(
      tap(x => this.checkError(x)),
      map(x => x.data!)
    )
  }

  determineRedirect(encryptedDn: string): Observable<string> {
    const url = `${window.baseUrl}/public/command`;
    const params = new HttpParams().set('processAction', 'determineRedirect')
      .set('newUserProfileId', window.newUserProfileId);
    const payload = { edn: encryptedDn }

    return this.http.post<PwmRestResult<string>>(url, payload, { params }).pipe(
      tap(x => this.checkError(x)),
      map(x => x.data!)
    )
  }
}