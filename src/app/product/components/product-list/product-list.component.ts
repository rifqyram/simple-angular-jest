import { Component, OnInit } from '@angular/core';
import { Observable, catchError, pipe } from 'rxjs';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { ProductService } from '../../services/product.service';
import { ProductResponse } from '../../models/IProductModel';
import handlingError from 'src/app/utils/handling-error';
import CommonResponse from 'src/app/shared/models/ICommonResponse';
import { swalConfirm } from 'src/app/utils/app-util';

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
    private readonly productService: ProductService
  ) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  private fetchProducts() {
    this.loadingService.showLoading();
    this.productService.getAll()
      .pipe(catchError(handlingError))
      .subscribe({
        next: (res: CommonResponse<ProductResponse[]>) => {
          this.products = res.data;
        },
        complete: () => this.loadingService.hideLoading()
      });
  }

  handleDelete(id: string) {
    swalConfirm('Are you sure want to remove this data', () => {
      this.productService.deleteById(id)
        .pipe(catchError(handlingError))
        .subscribe({
          next: (res) => {
            this.fetchProducts();
          },
        })
    });
  }
}
