import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/IAuthModel';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import CommonResponse from 'src/app/shared/models/ICommonResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly http: HttpClient) { }

  register(payload: RegisterRequest): Observable<CommonResponse<void>> {
    return this.http.post<CommonResponse<void>>(`api/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<ICommonResponse<AuthResponse>> {
    return this.http.post<ICommonResponse<AuthResponse>>(`api/auth/login`, payload);
  }

  getUserInfo(): Observable<ICommonResponse<AuthResponse>> {
    return this.http.get<ICommonResponse<AuthResponse>>('api/auth/user-info')
  }

  storeUser(data: AuthResponse): void {
    if (data) sessionStorage.setItem('user', JSON.stringify(data));
    return;
  }

  getUserFromStorage(): AuthResponse | null {
    const user: string = sessionStorage.getItem('user') as string;
    if (user) return JSON.parse(user);
    return null;
  }

  clearUserStorage(): void {
    let user = this.getUserFromStorage();
    if (!user) return;
    sessionStorage.removeItem('user');
  }
}
