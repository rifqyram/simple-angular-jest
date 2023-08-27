import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, catchError, map, switchMap, tap } from 'rxjs';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import { ActivatedRoute, Router } from '@angular/router';
import { NewProductRequest, UpdateProductRequest } from '../../models/IProductModel';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductService } from 'src/app/services/product.service';
import { UtilService } from 'src/app/services/util.service';

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
    private readonly route: ActivatedRoute,
    private readonly utilService: UtilService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.fetchById();
  }

  fetchById() {
    this.route.params
      .pipe(
        switchMap((params: any) => {
          if (params.id) {
            this.loadingService.showLoading();
            this.id = params.id;
            return this.productService.getById(params.id)
              .pipe(catchError((err) => this.utilService.handleHttpError(err)));
          }
          return EMPTY;
        })
      )
      .subscribe((res) => {
        this.setForm(res.data);
        this.loadingService.hideLoading();
      })
  }

  setForm(res: any) {
    this.form.patchValue({
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
        .pipe(catchError((err) => this.utilService.handleHttpError(err)))
        .subscribe({
          next: (res: ICommonResponse<void>) => {
            this.utilService.swalSuccess(res.message);
            this.router.navigate(['/products']).finally;
          },
          complete: () => this.loadingService.hideLoading()
        });
      return;
    }

    const payload: UpdateProductRequest = this.form.value;
    this.productService.update(payload)
      .pipe(catchError(err => this.utilService.handleHttpError(err)))
      .subscribe({
        next: (res: ICommonResponse<void>) => {
          this.utilService.swalSuccess(res.message);
          this.router.navigate(['/products']).finally;
        },
        complete: () => this.loadingService.hideLoading()
      });
  }

}
