import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormComponent } from './register-form.component';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginFormComponent } from '../login-form/login-form.component';
import { ProductListComponent } from 'src/app/product/components/product-list/product-list.component';
import { Router } from '@angular/router';
import { AuthResponse, RegisterRequest } from '../../models/IAuthModel';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UtilService } from 'src/app/services/util.service';
import { EMPTY, of, throwError } from 'rxjs';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let authService: any;
  let loadingService: any;
  let router: Router;
  let utilService: any;
  let handlingError: any;

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      getUserFromStorage: jest.fn(),
    };

    loadingService = {
      showLoading: jest.fn(),
      hideLoading: jest.fn()
    };

    utilService = {
      handleHttpError: jest.fn(),
      swalSuccess: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule.withRoutes([
        { path: 'login', component: LoginFormComponent },
        { path: 'products', component: ProductListComponent },
      ])],
      declarations: [RegisterFormComponent],
      providers: [{
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
    })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create instance Form Group and AbstractControl', () => {
    component.buildForm();

    expect(component.form).toBeTruthy();

    expect(component.form.get('email')).toBeDefined();
    expect(component.form.get('email')).toBeInstanceOf(AbstractControl);

    expect(component.form.get('password')).toBeDefined();
    expect(component.form.get('password')).toBeInstanceOf(AbstractControl);
  })

  it('should navigate to /products on fetchUserInfo if user exist', () => {
    const mockUser: AuthResponse = {
      userId: 'userIdTest',
      token: 'tokenTest',
    }

    jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(mockUser);
    jest.spyOn(router, 'navigate');

    component.fetchUserInfo();

    expect(authService.getUserFromStorage).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should do nothing on fetchUserInfo if user doesnt exist', () => {
    jest.spyOn(authService, 'getUserFromStorage');
    jest.spyOn(router, 'navigate');

    component.fetchUserInfo();

    expect(authService.getUserFromStorage).toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalledWith(['/products']);
  });

  it('should do nothing when form invalid when submit', () => {
    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(loadingService, 'hideLoading');

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalled();
    expect(authService.register).not.toHaveBeenCalled();
    expect(loadingService.hideLoading).toHaveBeenCalled();
  });

  it('should successfully register when form is valid', () => {
    const payload: RegisterRequest = {
      email: 'email@test.com',
      password: 'passwordTest',
    };

    const mockResponse: Partial<ICommonResponse<void>> = {
      status: 'OK',
      message: 'OK',
    }

    component.form.patchValue(payload);

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(authService, 'register').mockReturnValue(of(mockResponse));
    jest.spyOn(utilService, 'swalSuccess');
    jest.spyOn(router, 'navigate');
    jest.spyOn(loadingService, 'hideLoading');

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalled();
    expect(authService.register).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalled();
    expect(utilService.swalSuccess).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(loadingService.hideLoading).toHaveBeenCalled();
  });

  it('should catchError when something wrong with http', () => {
    const payload: RegisterRequest = {
      email: 'email@test.com',
      password: 'passwordTest',
    };

    const mockResponse: Partial<ICommonResponse<void>> = {
      status: 'OK',
      message: 'OK',
    }

    component.form.patchValue(payload);

    const mockError = { error: { errors: 'Invalid' } };

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(authService, 'register').mockReturnValue(throwError(() => of(mockError)))
    jest.spyOn(utilService, 'handleHttpError').mockReturnValue(() => EMPTY);

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalled();
    expect(utilService.handleHttpError).toHaveBeenCalled();
  });

});
