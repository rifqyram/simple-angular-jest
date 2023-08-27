import { TestBed } from '@angular/core/testing';

import { RequestInterceptor } from './request.interceptor';
import { AuthService } from 'src/app/services/auth.service';

describe('RequestInterceptor', () => {
  let authService: any;
  beforeEach(() => {
    authService = {
      getUserFromStorage: jest.fn()
    }

    TestBed.configureTestingModule({
      providers: [
        RequestInterceptor,
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    })
  });

  it('should be created', () => {
    const interceptor: RequestInterceptor = TestBed.inject(RequestInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
