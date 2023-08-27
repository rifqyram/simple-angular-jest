import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { BehaviorSubject, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from 'src/app/services/product.service';
import { LoadingService } from 'src/app/services/loading.service';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: any;
  let loadingService: any;
  let loadingSubject: BehaviorSubject<boolean>

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject(false);
    productService = {
      getAll: jest.fn(),
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
