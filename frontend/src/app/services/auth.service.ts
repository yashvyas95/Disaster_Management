import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { SignupRequestPayload } from '../signup/singup-request.payload';
import { Observable, throwError } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginRequestPayload } from '../login/login-request.payload';
import { LoginResponse } from '../login/login-response.payload';
import { map, tap } from 'rxjs/operators';
import { SignupRequestPayload } from '../signup/singup-request.payload';
import { HttpParams } from '@angular/common/http';
import { User } from '../model/User';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  refreshTokenPayload = {
    refreshToken: this.getRefreshToken(),
    username: this.getUserName()
  }

  constructor(private httpClient: HttpClient,
    private localStorage: LocalStorageService) {
  }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/auth/signup`, signupRequestPayload, { responseType: 'text' });
  }

  login(loginRequestPayload: LoginRequestPayload): Observable<boolean> {
    return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/auth/login`,
      loginRequestPayload).pipe(map(data => {
        this.localStorage.store('authenticationToken', data.accessToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', Date.now() + data.expiresIn);
        this.localStorage.store('role', data.role);
        this.localStorage.store('department', data.departmentId?.toString() || '');
        this.localStorage.store('email', data.email);
        this.loggedIn.emit(true);
        this.username.emit(data.username);
        return true;
      }));
  }

  getJwtToken() {
    const token = this.localStorage.retrieve('authenticationToken');
    return token && token !== 'undefined' ? token : null;
  }

  refreshToken() {
    return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/auth/refresh/token`,
      this.refreshTokenPayload)
      .pipe(tap(response => {
        this.localStorage.clear('authenticationToken');
        this.localStorage.clear('expiresAt');

        this.localStorage.store('authenticationToken',
          response.accessToken);
        this.localStorage.store('expiresAt', Date.now() + response.expiresIn);
      }));
  }

  logout() {
    this.httpClient.post(`${environment.apiUrl}/auth/logout`, this.refreshTokenPayload,
      { responseType: 'text' })
      .subscribe(data => {
        console.log(data);
      }, error => {
        throwError(error);
      })
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('refreshToken');
    this.localStorage.clear('expiresAt');
    this.localStorage.clear('role');
    this.localStorage.clear('department');
  }

  getUser(username:string){
    var params2 = new HttpParams().set('username', username);
    return this.httpClient.get(`${environment.apiUrl}/auth/userByUsername`,{params:params2});
  }

  getUserName() {
    return this.localStorage.retrieve('username');
  }
  getRefreshToken() {
    return this.localStorage.retrieve('refreshToken');
  }

  isLoggedIn(): boolean {
    const token = this.getJwtToken();
    return token != null && token !== '' && token !== 'undefined';
  }

  getAllUser(){
    return this.httpClient.get(`${environment.apiUrl}/auth/getAllEmp`);
  }

  registerVictim(victimData: any): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(`${environment.apiUrl}/auth/register-victim`, victimData)
      .pipe(map(data => {
        // Same storage logic as login
        this.localStorage.store('authenticationToken', data.accessToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('refreshToken', data.refreshToken);
        this.localStorage.store('expiresAt', Date.now() + data.expiresIn);
        this.localStorage.store('role', data.role);
        this.localStorage.store('email', data.email);
        this.loggedIn.emit(true);
        this.username.emit(data.username);
        return data;
      }));
  }

}
