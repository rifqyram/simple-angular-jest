import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { BehaviorSubject, of } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: any;
  let loadingService: any;
  let loadingSubject: BehaviorSubject<boolean>

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject(false);
    productService = {
      getAll: jest.fn().mockReturnValue(of({
        message: "success",
        status: "OK",
        errors: null,
        data: [
          {
            productId: "string",
            name: "string",
            description: "string",
            price: 0,
            stock: 0,
          }
        ]
      })),
      deleteById: jest.fn(),
    }
    loadingService = {
      loading: loadingSubject.asObservable(),
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
    }
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [RouterTestingModule],
      providers: [{
        provide: ProductService,
        useValue: productService,
      },
      {
        provide: LoadingService,
        useValue: loadingService,
      },
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
});
