import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFormComponent } from './register-form.component';
import { AuthService } from '../../services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let authService: any;
  let loadingService: any;

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      getUserFromStorage: jest.fn(),
    }
    loadingService = {
      showLoading: jest.fn(),
      hideLoading: jest.fn()
    }
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, FormsModule],
      declarations: [RegisterFormComponent],
      providers: [{
        provide: AuthService,
        useValue: authService
      },
      {
        provide: LoadingService,
        useValue: loadingService
      },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
