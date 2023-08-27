import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial loading value as false', () => {
    service.loading.subscribe((loading) => {
      expect(loading).toBe(false);
    });
  });

  it('should change loading value to true when showLoading is called', () => {
    service.showLoading();
    service.loading.subscribe((loading) => {
      expect(loading).toBe(true);
    });
  });

  it('should change loading value to false when hideLoading is called', () => {
    service.showLoading();
    service.hideLoading();
    service.loading.subscribe((loading) => {
      expect(loading).toBe(false);
    });
  });
});
