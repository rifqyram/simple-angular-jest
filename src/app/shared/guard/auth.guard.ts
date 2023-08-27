import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { AuthResponse } from 'src/app/auth/models/IAuthModel';
import { AuthService } from 'src/app/services/auth.service';


export const canActivate: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user: AuthResponse | null = authService.getUserFromStorage();

  if (user && user.token) {
    return authService.getUserInfo().pipe(map(({ data }) => {
      if (data) return true;
      router.navigate(['/login']);
      return false;
    }),
      catchError((err) => {
        authService.clearUserStorage();
        router.navigate(['/login']);
        return of(false);
      })
    )
  }

  router.navigate(['/login']);
  return of(false);

}

export const canActivateChild: CanActivateChildFn = (
  childRoute: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {

  const authService = inject(AuthService);
  const router = inject(Router);

  const user: AuthResponse | null = authService.getUserFromStorage();

  if (user && user.token) {
    return authService.getUserInfo().pipe(map(({ data }) => {
      if (data) return true;
      router.navigateByUrl('/login');
      return false;
    }),
      catchError((err) => {
        authService.clearUserStorage();
        router.navigateByUrl('/login');
        return of(false);
      })
    )
  }

  router.navigateByUrl('/login');
  return of(false);
}

