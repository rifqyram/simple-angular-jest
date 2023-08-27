import { Component, OnInit } from '@angular/core';
import { Observable, catchError, pipe } from 'rxjs';
import { ProductResponse } from '../../models/IProductModel';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import { LoadingService } from 'src/app/services/loading.service';
import { ProductService } from 'src/app/services/product.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: ProductResponse[] = [];
  isLoading: Observable<boolean> = this.loadingService.loading;

  constructor(
    private readonly loadingService: LoadingService,
    private readonly productService: ProductService,
    private readonly utilService: UtilService,
  ) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  private fetchProducts() {
    this.loadingService.showLoading();
    this.productService.getAll()
      .pipe(catchError(err => this.utilService.handleHttpError(err)))
      .subscribe({
        next: (res: ICommonResponse<ProductResponse[]>) => {
          this.products = res.data;
        },
        complete: () => this.loadingService.hideLoading()
      });
  }

  handleDelete(id: string) {
    this.utilService.swalConfirm('Are you sure want to remove this data', () => {
      this.productService.deleteById(id)
        .pipe(catchError(err => this.utilService.handleHttpError(err)))
        .subscribe({
          next: (res) => {
            this.fetchProducts();
          },
        })
    });
  }
}
