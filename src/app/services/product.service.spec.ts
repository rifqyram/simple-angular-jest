
import { of } from 'rxjs';
import { ProductService } from './product.service';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import { HttpParams } from '@angular/common/http';
import { NewProductRequest, ProductResponse, UpdateProductRequest } from '../product/models/IProductModel';

describe('ProductService', () => {
  let service: ProductService;
  let http: any;

  beforeEach(() => {
    http = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    }
    service = new ProductService(http)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return observable of ICommonResponse<void> when create', (done) => {
    const mockResponse: Partial<ICommonResponse<void>> = {
      status: 'CREATED',
      message: 'success',
    };

    jest.spyOn(http, 'post').mockReturnValue(of(mockResponse));

    const payload: NewProductRequest = {
      name: 'Laptop Wibu',
      description: 'Laptop',
      price: 15000000,
      stock: 10
    }
    service.create(payload).subscribe({
      next: (res: Partial<ICommonResponse<void>>) => {
        expect(res).toEqual(mockResponse);
        done();
      }
    });

    expect(http.post).toHaveBeenCalled();
    expect(http.post).toHaveBeenCalledWith('api/products', payload);
  });

  it('should return ICommonResponse<ProductResponse> when getById', (done) => {
    const mockResponse: Partial<ICommonResponse<ProductResponse>> = {
      status: 'CREATED',
      message: 'success',
      data: {
        productId: 'productIdTest',
        name: 'Laptop Wibu',
        description: 'Laptop',
        price: 15000000,
        stock: 10
      }
    };

    jest.spyOn(http, 'get').mockReturnValue(of(mockResponse));

    service.getById('1').subscribe({
      next: (res: Partial<ICommonResponse<ProductResponse>>) => {
        expect(res).toEqual(mockResponse);
        done();
      }
    });

    expect(http.get).toHaveBeenCalled();
    expect(http.get).toHaveBeenCalledWith('api/products/1');
  });

  it('should return observable of ICommonResponse<ProductResponse[]> when getAll', (done) => {
    const mockResponse: Partial<ICommonResponse<ProductResponse[]>> = {
      status: 'CREATED',
      message: 'success',
      data: [
        {
          productId: 'productIdTest',
          name: 'Laptop Wibu',
          description: 'Laptop',
          price: 15000000,
          stock: 10
        }
      ]
    };

    jest.spyOn(http, 'get').mockReturnValue(of(mockResponse));

    service.getAll().subscribe({
      next: (res: Partial<ICommonResponse<ProductResponse[]>>) => {
        expect(res).toEqual(mockResponse);
        expect(res.data?.length).toEqual(mockResponse.data?.length);
        done();
      }
    });

    expect(http.get).toHaveBeenCalled()
    expect(http.get).toHaveBeenCalledWith("api/products");
  })

  it('should return observable of ICommonResponse<void> when update', (done) => {
    const mockResponse: Partial<ICommonResponse<void>> = {
      status: 'OK',
      message: 'success',
    };

    jest.spyOn(http, 'put').mockReturnValue(of(mockResponse));

    const payload: UpdateProductRequest = {
      productId: 'productIdTest',
      name: 'Laptop Wibu Bawang',
      description: 'Laptop Wibu Bawang',
      price: 16000000,
      stock: 10
    }
    service.update(payload).subscribe({
      next: (res: Partial<ICommonResponse<void>>) => {
        expect(res).toEqual(mockResponse);
        done();
      }
    });

    expect(http.put).toHaveBeenCalled();
    expect(http.put).toHaveBeenCalledWith('api/products', payload);
  });

  it('should return observable of ICommonResponse<void> when delete', (done) => {
    const mockResponse: Partial<ICommonResponse<void>> = {
      status: 'OK',
      message: 'success',
    };

    jest.spyOn(http, 'delete').mockReturnValue(of(mockResponse));

    let id = 'productIdTest';
    service.deleteById(id).subscribe({
      next: (res: Partial<ICommonResponse<void>>) => {
        expect(res).toEqual(mockResponse);
        done();
      }
    });

    expect(http.delete).toHaveBeenCalled();
    expect(http.delete).toHaveBeenCalledWith(`api/products/${id}`);
  });

});
