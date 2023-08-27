import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginFormComponent } from 'src/app/auth/components/login-form/login-form.component';
import { AuthService } from 'src/app/services/auth.service';
import { AuthResponse } from 'src/app/auth/models/IAuthModel';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authService: any;
  let router: Router;

  beforeEach(async () => {
    authService = {
      isLoggedIn$: of(false),
      getUserFromStorage: jest.fn(),
      clearUserStorage: jest.fn(),
      getUserInfo: jest.fn(() => of()),
    }

    await TestBed.configureTestingModule({
      declarations: [SidebarComponent],
      imports: [RouterTestingModule.withRoutes([
        { path: 'login', component: LoginFormComponent }
      ])],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        }
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should getUserInfo successfully when fetchUser', () => {
    const mockUser: AuthResponse = {
      token: 'tokenTest',
      userId: 'userIdTest',
    }
    jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(mockUser);
    jest.spyOn(authService, 'getUserInfo').mockReturnValue(of(mockUser));

    component.fetchUser();

    expect(authService.getUserFromStorage).toHaveBeenCalled();
    expect(authService.getUserInfo).toHaveBeenCalled();
  });

  it('it should getUserInfo failed when no user in storage', () => {
    jest.spyOn(authService, 'getUserFromStorage');
    jest.spyOn(authService, 'getUserInfo');

    component.fetchUser();

    expect(authService.getUserFromStorage).toHaveBeenCalled();
    expect(authService.getUserInfo).not.toHaveBeenCalled();
  });

  it('should set isLoggedIn to false and clear storage when handleLogout', () => {
    jest.spyOn(authService, 'clearUserStorage');
    jest.spyOn(router, 'navigate');

    component.handleLogout();

    expect(authService.clearUserStorage).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should set isExpand to true if window width is greater than 768', () => {
    (global as any).innerWidth = 769;

    component.onWindowResize();

    expect(component.isExpand).toBe(true);
  });

  it('should set isExpand to false if window width is less than 768', () => {
    const resizeEvent = new Event('resize');
    (global as any).innerWidth = 767;

    component.onWindowResize();

    expect(component.isExpand).toBe(false);
  });

  it('should set isExpand to true or false', () => {
    component.isExpand = false;
    component.handleExpanded();
    expect(component.isExpand).toBe(true);
  })
});
