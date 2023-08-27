import { AuthService } from './auth.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../auth/models/IAuthModel';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import { of } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let http: any;

  beforeEach(() => {
    http = {
      get: jest.fn(),
      post: jest.fn(),
    };

    authService = new AuthService(http);
  });


  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should return observable of CommonResponse when register', (done) => {
    const response: Partial<ICommonResponse<void>> = {
      message: "success",
      status: "CREATED",
    };
    jest.spyOn(http, "post").mockReturnValue(of(response));

    const payload: RegisterRequest = {
      email: "test@gmail.com",
      password: "testpassword",
    }

    authService.register(payload).subscribe({
      next: (res: Partial<ICommonResponse<void>>) => {
        authService.isLoggedIn$.subscribe({
          next: (bool) => {
            expect(bool).toBeTruthy();
          }
        })
        expect(res).toEqual(response);
        done();
      }
    });

    expect(http.post).toHaveBeenCalledTimes(1);
    expect(http.post).toHaveBeenCalledWith("api/auth/register", payload);
  });

  it('should return observable of CommonResponse<AuthResponse> when login', (done) => {
    const response: Partial<ICommonResponse<AuthResponse>> = {
      message: "success",
      status: "OK",
      data: {
        userId: "userIdTest",
        token: "userTokenTest"
      }
    }

    jest.spyOn(http, "post").mockReturnValue(of(response));

    const payload: LoginRequest = {
      email: "testEmail@test.com",
      password: "password"
    }
    authService.login(payload).subscribe({
      next: (res: Partial<ICommonResponse<AuthResponse>>) => {
        expect(res).toEqual(response);
        done();
      }
    });

    expect(http.post).toHaveBeenCalledTimes(1);
    expect(http.post).toHaveBeenCalledWith("api/auth/login", payload);
  });

  it('should return observable of CommonResponse<AuthResponse> when getUserInfo', (done) => {
    const response: Partial<ICommonResponse<AuthResponse>> = {
      message: "success",
      status: "OK",
      data: {
        userId: "userIdTest",
        token: "tokenTest",
      }
    }
    jest.spyOn(http, "get").mockReturnValue(of(response));

    authService.getUserInfo().subscribe({
      next: (res: Partial<ICommonResponse<AuthResponse>>) => {
        expect(res).toEqual(response);
        done();
      }
    });

    expect(http.get).toHaveBeenCalledTimes(1);
  });

  it('should storeUser', () => {
    Storage.prototype.setItem = jest.fn();
    jest.spyOn(Storage.prototype, 'setItem');

    const data: AuthResponse = {
      userId: 'userIdTest',
      token: 'tokenTest',
    };

    authService.storeUser(data);

    expect(sessionStorage.setItem).toHaveBeenCalled();
    expect(sessionStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(data));
  });

  it('should return AuthResponse when getUserFromStorage success', () => {
    const mockResponse: AuthResponse = {
      userId: 'userIdTest',
      token: 'tokenTest',
    };

    Storage.prototype.getItem = jest.fn();
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockResponse));

    const response = authService.getUserFromStorage();

    expect(response).toEqual(JSON.parse(JSON.stringify(mockResponse)))
    expect(sessionStorage.getItem).toHaveBeenCalled();
    expect(sessionStorage.getItem).toHaveBeenCalledWith('user')
  });

  it('should clearStorage success', () => {
    const mockResponse: AuthResponse = {
      userId: 'userIdTest',
      token: 'tokenTest',
    };

    Storage.prototype.getItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(JSON.stringify(mockResponse));
    jest.spyOn(Storage.prototype, 'removeItem');

    authService.clearUserStorage();

    expect(sessionStorage.removeItem).toHaveBeenCalled();
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('user');
  })

  it('should clearStorage failed', () => {
    Storage.prototype.getItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    jest.spyOn(Storage.prototype, 'removeItem');

    authService.clearUserStorage();
    authService.isLoggedIn$.subscribe({
      next: (res) => {
        expect(res).toBeFalsy();
      }
    });

    expect(sessionStorage.removeItem).not.toHaveBeenCalled();
  })

});
