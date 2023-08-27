import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { ProductService } from 'src/app/services/product.service';
import { LoadingService } from 'src/app/services/loading.service';
import { UtilService } from 'src/app/services/util.service';
import { AppModule } from 'src/app/app.module';
import { of, throwError } from 'rxjs';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import { ProductResponse } from '../../models/IProductModel';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: any;
  let loadingService: any;
  let utilService: any;

  beforeEach(async () => {
    productService = {
      getAll: jest.fn(() => of()),
      deleteById: jest.fn(),
    }
    loadingService = {
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
    };
    utilService = {
      swalConfirm: jest.fn(),
      handleHttpError: jest.fn(),
    }

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [AppModule],
      providers: [
        {
          provide: ProductService,
          useValue: productService,
        },
        {
          provide: LoadingService,
          useValue: loadingService,
        },
        {
          provide: UtilService,
          useValue: utilService,
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should successfully fetchProduct', () => {
    const mockProducts: ICommonResponse<ProductResponse[]> = {
      status: 'OK',
      errors: null,
      message: 'OK',
      data: [
        {
          productId: '1',
          name: 'dummyProduct1',
          description: 'dummyProduct1',
          price: 10000,
          stock: 10,
        },
        {
          productId: '2',
          name: 'dummyProduct2',
          description: 'dummyProduct2',
          price: 20000,
          stock: 10,
        }
      ]
    }
    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(productService, 'getAll').mockReturnValue(of(mockProducts));
    jest.spyOn(loadingService, 'hideLoading');

    component.fetchProducts();

    expect(loadingService.showLoading).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts.data);
    expect(loadingService.hideLoading).toHaveBeenCalled();
  });

  it('should handle error when fetchProducts', () => {
    const mockError = {
      error: { errors: 'invalid' }
    };

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(productService, 'getAll').mockReturnValue(throwError(() => of(mockError)))
    jest.spyOn(utilService, 'handleHttpError');

    component.fetchProducts();

    expect(loadingService.showLoading).toHaveBeenCalled();
    expect(utilService.handleHttpError).toHaveBeenCalled();
  });

  it('should successfully delete when confirmed on handleDelete', () => {
    jest.spyOn(utilService, 'swalConfirm')
      .mockImplementation((_, callback: any) => callback());
    jest.spyOn(productService, 'deleteById').mockReturnValue(of(null));
    jest.spyOn(component, 'fetchProducts');

    const id = '1';
    component.handleDelete(id);

    expect(utilService.swalConfirm).toHaveBeenCalled();
    expect(productService.deleteById).toHaveBeenCalledWith(id);
    expect(component.fetchProducts).toHaveBeenCalled();
  });

  it('should handleError when handleDelete', () => {
    const mockError = { error: { errors: 'invalid' } };
    jest.spyOn(utilService, 'swalConfirm')
      .mockImplementation((_, callback: any) => callback());
    jest.spyOn(productService, 'deleteById').mockReturnValue(throwError(() => of(mockError)));
    jest.spyOn(utilService, 'handleHttpError');

    const id = '1';
    component.handleDelete(id);

    expect(utilService.swalConfirm).toHaveBeenCalled();
    expect(productService.deleteById).toHaveBeenCalledWith(id);
    expect(utilService.handleHttpError).toHaveBeenCalled();
  })

});
