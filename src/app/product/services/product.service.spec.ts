import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let http: any;

  beforeEach(() => {
    http = {
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      deleteById: jest.fn()
    }
    service = new ProductService(http)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
