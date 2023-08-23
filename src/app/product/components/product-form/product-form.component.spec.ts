import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: any;
  let loadingService: any;

  beforeEach(async () => {
    productService = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
    }
    loadingService = {
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
    }

    await TestBed.configureTestingModule({
      declarations: [ProductFormComponent],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers: [
        {
          provide: ProductService,
          useValue: productService
        },
        {
          provide: LoadingService,
          useValue: loadingService
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
