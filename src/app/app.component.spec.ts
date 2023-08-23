import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/services/auth.service';
import { LoadingService } from './shared/services/loading.service';

describe('AppComponent', () => {
  let authService: any;

  beforeEach(async () => {
    authService = {
      getUserFromStorage: jest.fn(),
      clearUserStorage: jest.fn()
    }

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        AuthService,
        LoadingService
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
