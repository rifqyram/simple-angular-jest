import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";
import { AuthGuard } from "./auth.guard";
import { Observable, of, throwError } from "rxjs";
import { RouterTestingModule } from "@angular/router/testing";
import { LoginFormComponent } from "src/app/auth/components/login-form/login-form.component";
import { AuthResponse } from "src/app/auth/models/IAuthModel";

describe('AuthGuard', () => {
    let authService: any;
    let router: any;
    let authGuard: AuthGuard;
    let activatedRouteSnapshot: any;
    let routerStateSnapshot: any;

    beforeEach(() => {
        authService = {
            getUserFromStorage: jest.fn(),
            getUserInfo: jest.fn(),
            clearUserStorage: jest.fn(),
        };

        router = {
            navigate: jest.fn(),
        }

        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([
                {
                    path: 'login',
                    component: LoginFormComponent,
                }
            ])],
            providers: [
                {
                    provide: AuthService,
                    useValue: authService,
                },
                {
                    provide: ActivatedRouteSnapshot,
                    useClass: activatedRouteSnapshot,
                },
                {
                    provide: RouterStateSnapshot,
                    useClass: routerStateSnapshot,
                },
                {
                    provide: Router,
                    useClass: router,
                },
            ]
        });

        authGuard = new AuthGuard(authService, router);
    });

    it('should be created', () => {
        expect(authGuard).toBeTruthy();
    });

    it('should allow activation if user authenticated on canActivate', (done) => {
        const mockUser = {
            userId: 'userTest',
            token: 'tokenTest',
        };

        jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(mockUser);
        jest.spyOn(authService, 'getUserInfo').mockReturnValue(of({ data: mockUser }));

        (authGuard.canActivate(activatedRouteSnapshot, routerStateSnapshot) as any)
            .subscribe({
                next: (res: any) => {
                    expect(res).toBeTruthy();
                    done();
                }
            });

        expect(authService.getUserFromStorage).toHaveBeenCalled();
        expect(authService.getUserInfo).toHaveBeenCalled();
    });

    it('should navigate to /login if user not authenticated on canActivate', (done) => {
        const mockUser = {
            userId: 'userTest',
            token: 'tokenTest',
        };

        jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(mockUser);
        jest.spyOn(authService, 'getUserInfo').mockReturnValue(of({ data: null }));
        jest.spyOn(router, 'navigate');

        (authGuard.canActivate(activatedRouteSnapshot, routerStateSnapshot) as any).subscribe({
            next: (res: any) => {
                expect(res).toBeFalsy();
                expect(router.navigate).toHaveBeenCalledWith(['/login']);
                done();
            }
        });

        expect(authService.getUserFromStorage).toHaveBeenCalled()
        expect(authService.getUserInfo).toHaveBeenCalled()
    });

    it('should return observable false and navigate to login when user not authenticate on canActivate', (done) => {
        jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(null);

        (authGuard.canActivate(activatedRouteSnapshot, routerStateSnapshot) as any).subscribe({
            next: (res: any) => {
                expect(res).toBeFalsy();
                expect(router.navigate).toHaveBeenCalledWith(['/login']);
                done();
            }
        });

        expect(authService.getUserFromStorage).toHaveBeenCalled();
    });

    it('should allow activation if user authenticated on canActivateChild', (done) => {
        const mockUser = {
            userId: 'userTest',
            token: 'tokenTest',
        };

        jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(mockUser);
        jest.spyOn(authService, 'getUserInfo').mockReturnValue(of({ data: mockUser }));

        (authGuard.canActivateChild(activatedRouteSnapshot, routerStateSnapshot) as any)
            .subscribe({
                next: (res: any) => {
                    expect(res).toBeTruthy();
                    done();
                }
            });

        expect(authService.getUserFromStorage).toHaveBeenCalled();
        expect(authService.getUserInfo).toHaveBeenCalled();
    });

    it('should navigate to /login if user not authenticated on canActivateChild', (done) => {
        const mockUser = {
            userId: 'userTest',
            token: 'tokenTest',
        };

        jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(mockUser);
        jest.spyOn(authService, 'getUserInfo').mockReturnValue(of({ data: null }));
        jest.spyOn(router, 'navigate');

        (authGuard.canActivateChild(activatedRouteSnapshot, routerStateSnapshot) as any).subscribe({
            next: (res: any) => {
                expect(res).toBeFalsy();
                expect(router.navigate).toHaveBeenCalledWith(['/login']);
                done();
            }
        });

        expect(authService.getUserFromStorage).toHaveBeenCalled()
        expect(authService.getUserInfo).toHaveBeenCalled()
    });

    it('should return observable false and navigate to login when user not authenticate on canActivateChild', (done) => {
        jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(null);

        (authGuard.canActivateChild(activatedRouteSnapshot, routerStateSnapshot) as any).subscribe({
            next: (res: any) => {
                expect(res).toBeFalsy();
                expect(router.navigate).toHaveBeenCalledWith(['/login']);
                done();
            }
        });

        expect(authService.getUserFromStorage).toHaveBeenCalled();
    });

});