import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormComponent } from './login-form.component';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { BehaviorSubject } from 'rxjs';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authService: any;
  let loadingService: any;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject(false)
    authService = {
      login: jest.fn(),
    }
    loadingService = {
      loading: loadingSubject.asObservable(),
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
    }

    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: LoadingService,
          useValue: loadingService
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
