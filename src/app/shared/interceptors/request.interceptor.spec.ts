import { TestBed } from '@angular/core/testing';

import { RequestInterceptor } from './request.interceptor';
import { AuthService } from 'src/app/services/auth.service';
import { of } from 'rxjs';
import { HttpEvent, HttpEventType, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';

describe('RequestInterceptor', () => {
  let authService: any;
  let interceptor: RequestInterceptor;

  beforeEach(() => {
    authService = {
      getUserFromStorage: jest.fn()
    }

    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: authService
        }
      ],
    })

    interceptor = new RequestInterceptor(authService);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add header if user logged in', () => {
    const mockUser = {
      token: 'token',
    }
    const httpRequest: any = {
      clone: jest.fn(),
    };

    const httpHandler: any = {
      handle: jest.fn(),
    };

    const httpEvent: HttpEvent<any> = new HttpResponse<any>();

    jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(mockUser);
    jest.spyOn(httpRequest, 'clone').mockReturnValue(httpRequest);
    jest.spyOn(httpHandler, 'handle').mockReturnValue(of(httpEvent));

    interceptor.intercept(httpRequest, httpHandler);

    expect(authService.getUserFromStorage).toHaveBeenCalled();
    expect(httpRequest.clone).toHaveBeenCalledWith({
      setHeaders: {
        Authorization: `Bearer ${mockUser.token}`
      }
    });
    expect(httpHandler.handle).toHaveBeenCalledWith(httpRequest);
  });

  it('should next if no user', () => {
    const mockUser = {
      token: 'token',
    }
    const httpRequest: any = {
      clone: jest.fn(),
    };

    const httpHandler: any = {
      handle: jest.fn(),
    };

    const httpEvent: HttpEvent<any> = new HttpResponse<any>();

    jest.spyOn(authService, 'getUserFromStorage').mockReturnValue(null);
    jest.spyOn(httpHandler, 'handle').mockReturnValue(of(httpEvent));

    interceptor.intercept(httpRequest, httpHandler);

    expect(authService.getUserFromStorage).toHaveBeenCalled();
    expect(httpHandler.handle).toHaveBeenCalledWith(httpRequest);
  })

});
