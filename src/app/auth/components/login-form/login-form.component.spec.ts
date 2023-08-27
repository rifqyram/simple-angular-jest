import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import { Router } from '@angular/router';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { EMPTY, of, throwError } from 'rxjs';
import { AuthResponse } from '../../models/IAuthModel';
import { ProductListComponent } from 'src/app/product/components/product-list/product-list.component';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UtilService } from 'src/app/services/util.service';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authService: Partial<AuthService>;
  let loadingService: any;
  let utilService: any;
  let router: Router;

  beforeEach(async () => {
    authService = {
      getUserFromStorage: jest.fn(),
      login: jest.fn(),
      storeUser: jest.fn(),
    }
    loadingService = {
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
    }

    utilService = {
      handleHttpError: jest.fn(),
      swalSuccess: jest.fn(),
      swalError: jest.fn(),
    }

    await TestBed.configureTestingModule({
      declarations: [
        LoginFormComponent,
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'products', component: ProductListComponent }
        ])
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: LoadingService,
          useValue: loadingService
        },
        {
          provide: UtilService,
          useValue: utilService,
        },
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to /products when user loggedIn', () => {
    const mockResponse: AuthResponse = {
      userId: 'userIdTest',
      token: 'tokenTest',
    };

    jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(mockResponse);
    jest.spyOn(router, 'navigate');

    component.fetchUser();

    expect(authService.getUserFromStorage).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('FormGroup and FornControl must be initialize successfully', () => {
    expect(component.form).toBeTruthy();

    expect(component.form.get('email')).toBeDefined()
    expect(component.form.get('email')).toBeInstanceOf(AbstractControl)

    expect(component.form.get('password')).toBeDefined()
    expect(component.form.get('password')).toBeInstanceOf(AbstractControl)
  });

  it('should do nothing when form invalid', () => {
    component.form.setValue({
      email: '',
      password: '',
    });

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(loadingService, 'hideLoading');

    component.submit();

    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should submit login when form valid', () => {
    component.form.patchValue({
      email: 'test@gmail.com',
      password: 'passwordTest',
    });

    const mockAuthResponse: ICommonResponse<AuthResponse> = {
      errors: null,
      message: 'success',
      status: 'OK',
      data: {
        userId: 'userIdTest',
        token: 'tokenTest',
      }
    }

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(authService, 'login').mockReturnValue(of(mockAuthResponse));
    jest.spyOn(authService, 'storeUser');
    jest.spyOn(router, 'navigate');
    jest.spyOn(utilService, 'swalSuccess');
    jest.spyOn(loadingService, 'hideLoading');

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalledWith(component.form.value);
    expect(authService.storeUser).toHaveBeenCalled();
    expect(utilService.swalSuccess).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled()
    expect(router.navigate).toHaveBeenCalledWith(['/products'])
    expect(loadingService.hideLoading).toHaveBeenCalled();
  });

  it('should catch error on submit if something wrong', () => {
    component.form.patchValue({
      email: 'test@gmail.com',
      password: 'passwordTest',
    });

    const mockError = { error: { errors: 'Invalid credentials' } };

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => of(mockError)))
    jest.spyOn(utilService, 'handleHttpError').mockReturnValue(() => EMPTY);

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalled();
    expect(utilService.handleHttpError).toHaveBeenCalled();
  });
});
