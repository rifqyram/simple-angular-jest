import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { AuthResponse } from 'src/app/auth/models/IAuthModel';
import { AuthService } from 'src/app/services/auth.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user: AuthResponse | null = this.authService.getUserFromStorage();

    if (user && user.token) {
      return this.authService.getUserInfo()
        .pipe(map(({ data }) => {
          if (data) return true;
          this.router.navigate(['/login']);
          return false;
        }));
    }

    this.router.navigate(['/login']);
    return of(false);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const user: AuthResponse | null = this.authService.getUserFromStorage();

    if (user?.token) {
      return this.authService.getUserInfo().pipe(map(({ data }) => {
        if (data) return true;
        this.router.navigate(['/login']);
        return false;
      }));
    }

    this.router.navigate(['/login']);
    return of(false);
  }
}

