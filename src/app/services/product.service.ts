import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import ICommonResponse from 'src/app/shared/models/ICommonResponse';
import { NewProductRequest, ProductResponse, UpdateProductRequest } from '../product/models/IProductModel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private readonly http: HttpClient) { }

  create(payload: NewProductRequest): Observable<ICommonResponse<void>> {
    return this.http.post<ICommonResponse<void>>(`api/products`, payload);
  }

  getById(id: string): Observable<ICommonResponse<ProductResponse>> {
    return this.http.get<ICommonResponse<ProductResponse>>(`api/products/${id}`)
  }

  getAll(): Observable<ICommonResponse<ProductResponse[]>> {
    return this.http.get<ICommonResponse<ProductResponse[]>>(`api/products`);
  }

  update(payload: UpdateProductRequest): Observable<ICommonResponse<void>> {
    return this.http.put<ICommonResponse<void>>(`api/products`, payload);
  }

  deleteById(id: string): Observable<ICommonResponse<void>> {
    return this.http.delete<ICommonResponse<void>>(`api/products/${id}`);
  }

}
