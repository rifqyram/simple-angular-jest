import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/services/auth.service';
import { LoadingService } from './shared/services/loading.service';
import { BehaviorSubject } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let authService: any;
  let loadingService: any;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject(false);
    authService = {
      getUserFromStorage: jest.fn(),
      clearUserStorage: jest.fn()
    }
    loadingService = {
      loading: loadingSubject.asObservable(),
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
    }

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        AppRoutingModule,
        SharedModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: LoadingService,
          useValue: loadingService,
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges()
    expect(app).toBeTruthy();
  });
});
