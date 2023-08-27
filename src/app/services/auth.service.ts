import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, LoginRequest, RegisterRequest } from 'src/app/auth/models/IAuthModel';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private readonly http: HttpClient) { }

  register(payload: RegisterRequest): Observable<ICommonResponse<void>> {
    return this.http.post<ICommonResponse<void>>(`api/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<ICommonResponse<AuthResponse>> {
    return this.http.post<ICommonResponse<AuthResponse>>(`api/auth/login`, payload)
      .pipe(tap(res => {
        if (res?.data) {
          this.isLoggedIn.next(true);
        }
      }));
  }

  getUserInfo(): Observable<ICommonResponse<AuthResponse>> {
    return this.http.get<ICommonResponse<AuthResponse>>('api/auth/user-info')
      .pipe(tap(res => {
        if (res?.data) {
          this.isLoggedIn.next(true);
        }
      }))
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
    this.isLoggedIn.next(false);
  }
}
