import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from 'src/app/services/product.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductListComponent } from '../product-list/product-list.component';
import { of, throwError } from 'rxjs';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import { NewProductRequest, ProductResponse, UpdateProductRequest } from '../../models/IProductModel';
import { UtilService } from 'src/app/services/util.service';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: Partial<ProductService>;
  let loadingService: any;
  let utilsService: any;
  let route: ActivatedRoute;
  let router: Router;

  beforeEach(async () => {
    productService = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
    }
    loadingService = {
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
    };
    utilsService = {
      swalSuccess: jest.fn(),
      handleHttpError: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule.withRoutes([
        {
          path: 'products',
          component: ProductListComponent
        }
      ])],
      providers: [
        {
          provide: ProductService,
          useValue: productService
        },
        {
          provide: LoadingService,
          useValue: loadingService
        },
        {
          provide: UtilService,
          useValue: utilsService,
        }
      ]
    })
      .compileComponents();

    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should successfully instance FormGroup and AbstractControl', () => {
    component.buildForm();

    expect(component.form).toBeDefined();
    expect(component.form).toBeInstanceOf(FormGroup);

    expect(component.form.get('productId')).toBeDefined();
    expect(component.form.get('productId')).toBeInstanceOf(AbstractControl);

    expect(component.form.get('name')).toBeDefined();
    expect(component.form.get('name')).toBeInstanceOf(AbstractControl);

    expect(component.form.get('description')).toBeDefined();
    expect(component.form.get('description')).toBeInstanceOf(AbstractControl);

    expect(component.form.get('price')).toBeDefined();
    expect(component.form.get('price')).toBeInstanceOf(AbstractControl);

    expect(component.form.get('stock')).toBeDefined();
    expect(component.form.get('stock')).toBeInstanceOf(AbstractControl);
  });

  it('should fetchById success', () => {
    let productId = '1';
    route.params = of({ id: productId });

    const productResponseMock: ICommonResponse<ProductResponse> = {
      status: 'OK',
      message: 'OK',
      errors: null,
      data: {
        productId,
        name: 'productDummy',
        description: 'productDummy',
        price: 10000,
        stock: 10,
      }
    }

    jest.spyOn(route.params, 'pipe');
    jest.spyOn(productService, 'getById').mockReturnValue(of(productResponseMock))
    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(loadingService, 'hideLoading');

    component.fetchById();

    expect(route.params.pipe).toHaveBeenCalledTimes(1);
    expect(loadingService.showLoading).toHaveBeenCalledTimes(1);
    expect(productService.getById).toHaveBeenCalledTimes(1);
    expect(component.form.value).toEqual(productResponseMock.data);
    expect(loadingService.hideLoading).toHaveBeenCalledTimes(1);
  });

  it('should catchError when fetchById', () => {
    let productId = '1';
    route.params = of({ id: productId });

    const mockError = { error: { errors: 'invalid' } };

    const setForm = jest.spyOn(component, 'setForm');

    jest.spyOn(route.params, 'pipe');
    jest.spyOn(productService, 'getById').mockReturnValue(throwError(() => of(mockError)))
    jest.spyOn(utilsService, 'handleHttpError');
    jest.spyOn(loadingService, 'showLoading');

    component.fetchById();

    expect(route.params.pipe).toHaveBeenCalledTimes(1);
    expect(loadingService.showLoading).toHaveBeenCalledTimes(1);
    expect(productService.getById).toHaveBeenCalledTimes(1);
    expect(utilsService.handleHttpError).toHaveBeenCalledTimes(1);
    expect(setForm).not.toHaveBeenCalled();
  });

  it('should do nothing when form invalid', () => {
    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(loadingService, 'hideLoading');

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalledTimes(1);
    expect(loadingService.hideLoading).toHaveBeenCalledTimes(1);
    expect(productService.create).not.toHaveBeenCalled();
    expect(productService.update).not.toHaveBeenCalled();
  });

  it('should create product successfully when submit', () => {
    const mockPayload: NewProductRequest = {
      name: 'DummyName',
      description: 'DummyDescription',
      price: 10000,
      stock: 10,
    };

    component.form.patchValue(mockPayload);

    const mockResponseProduct: any = {
      status: 'CREATED',
      message: 'OK',
    };

    component.id = undefined;

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(productService, 'create').mockReturnValue(of(mockResponseProduct));
    jest.spyOn(utilsService, 'swalSuccess');
    jest.spyOn(router, 'navigate');
    jest.spyOn(loadingService, 'hideLoading');

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalledTimes(1);
    expect(productService.create).toHaveBeenCalledTimes(1);
    expect(utilsService.swalSuccess).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
    expect(loadingService.hideLoading).toHaveBeenCalledTimes(1);
  });

  it('should catchError when submit create', () => {
    const mockPayload: NewProductRequest = {
      name: 'DummyName',
      description: 'DummyDescription',
      price: 10000,
      stock: 10,
    };

    component.form.patchValue(mockPayload);

    const mockError = { error: { error: 'invalid' } };

    component.id = undefined;

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(productService, 'create').mockReturnValue(throwError(() => of(mockError)));
    jest.spyOn(utilsService, 'handleHttpError');

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalledTimes(1);
    expect(productService.create).toHaveBeenCalledTimes(1);
    expect(utilsService.handleHttpError).toHaveBeenCalledTimes(1);
  });

  it('should update product successfully when submit', () => {
    const mockPayload: UpdateProductRequest = {
      productId: '1',
      name: 'DummyNameUpdate',
      description: 'DummyDescriptionUpdate',
      price: 10000,
      stock: 10,
    };
    component.id = '1';

    component.form.patchValue(mockPayload);

    const mockResponseProduct: any = {
      status: 'OK',
      message: 'OK',
    };

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(productService, 'update').mockReturnValue(of(mockResponseProduct));
    jest.spyOn(utilsService, 'swalSuccess');
    jest.spyOn(router, 'navigate');
    jest.spyOn(loadingService, 'hideLoading');

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalledTimes(1);
    expect(productService.update).toHaveBeenCalledTimes(1);
    expect(utilsService.swalSuccess).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
    expect(loadingService.hideLoading).toHaveBeenCalledTimes(1);
  });

  it('should catchError when submit update', () => {
    const mockPayload: UpdateProductRequest = {
      productId: '1',
      name: 'DummyNameUpdate',
      description: 'DummyDescriptionUpdate',
      price: 10000,
      stock: 10,
    };

    component.form.patchValue(mockPayload);

    const mockError = { error: { error: 'invalid' } };

    component.id = '1';

    jest.spyOn(loadingService, 'showLoading');
    jest.spyOn(productService, 'update').mockReturnValue(throwError(() => of(mockError)));
    jest.spyOn(utilsService, 'handleHttpError');

    component.submit();

    expect(loadingService.showLoading).toHaveBeenCalledTimes(1);
    expect(productService.update).toHaveBeenCalledTimes(1);
    expect(utilsService.handleHttpError).toHaveBeenCalledTimes(1);
  });
});
