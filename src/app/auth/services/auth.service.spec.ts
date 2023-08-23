import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let http: any;

  beforeEach(() => {
    http = {
      register: jest.fn(),
      login: jest.fn(),
      getUserInfo: jest.fn(),
      storeUser: jest.fn(),
      getUserFromStorage: jest.fn(),
      clearUserStorage: jest.fn()
    }
    service = new AuthService(http)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
