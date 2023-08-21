import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProductService } from '../../services/product.service';
import CommonResponse from 'src/app/shared/models/ICommonResponse';
import { swalSuccess } from 'src/app/utils/app-util';
import { ActivatedRoute, Router } from '@angular/router';
import handlingError from 'src/app/utils/handling-error';
import { NewProductRequest, ProductResponse, UpdateProductRequest } from '../../models/IProductModel';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  id?: string;
  form!: FormGroup;
  isLoading: Observable<boolean> = this.loadingService.loading;

  constructor(
    private readonly loadingService: LoadingService,
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.fetchById();
  }

  private fetchById() {
    this.route.params.pipe(switchMap((params) => {
      if (params && params['id']) {
        this.loadingService.showLoading();
        this.id = params['id'];
        return this.productService.getById(params['id'])
          .pipe(switchMap(res => of(res.data)));
      }
      return EMPTY;
    }), catchError(handlingError)).subscribe({
      next: (res) => {
        this.setForm(res);
        this.loadingService.hideLoading()
      },
      complete: () => this.loadingService.hideLoading()
    });
  }

  private setForm(res: ProductResponse) {
    this.form.setValue({
      productId: this.id,
      name: res?.name,
      description: res?.description,
      price: res?.price,
      stock: res?.stock,
    });
  }

  buildForm() {
    this.form = new FormGroup({
      productId: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(1)]),
      stock: new FormControl(0, [Validators.required, Validators.min(0)]),
    });
  }

  submit() {
    this.loadingService.showLoading();

    if (this.form.invalid) {
      this.loadingService.hideLoading();
      return
    }


    if (!this.id) {
      const payload: NewProductRequest = this.form.value;

      this.productService.create(payload)
        .pipe(catchError(handlingError))
        .subscribe({
          next: (res: CommonResponse<void>) => {
            swalSuccess(res.message);
            this.router.navigateByUrl('/products');
          },
          complete: () => this.loadingService.hideLoading()
        });
      return;
    }

    const payload: UpdateProductRequest = this.form.value;
    this.productService.update(payload)
      .pipe(catchError(handlingError))
      .subscribe({
        next: (res: CommonResponse<void>) => {
          swalSuccess(res.message);
          this.router.navigateByUrl('/products');
        },
        complete: () => this.loadingService.hideLoading()
      });
    return;
  }

}
