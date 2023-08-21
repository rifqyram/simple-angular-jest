import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NewProductRequest, ProductResponse, SearchProductRequest, UpdateProductRequest } from '../models/IProductModel';
import { Observable } from 'rxjs';
import CommonResponse from 'src/app/shared/models/ICommonResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private readonly http: HttpClient) { }

  create(payload: NewProductRequest): Observable<CommonResponse<void>> {
    return this.http.post<CommonResponse<void>>(`api/products`, payload);
  }

  getById(id: string): Observable<CommonResponse<ProductResponse>> {
    return this.http.get<CommonResponse<ProductResponse>>(`api/products/${id}`)
  }

  getAll(payload?: SearchProductRequest): Observable<CommonResponse<ProductResponse[]>> {
    const queryParams = new HttpParams();

    if (payload) {
      for (const key of Object(payload)) {
        const paramValue: string = `${payload.name}`;
        queryParams.append(key, paramValue);
      }
    }

    return this.http.get<CommonResponse<ProductResponse[]>>(`api/products`, { params: queryParams });
  }

  update(payload: UpdateProductRequest): Observable<CommonResponse<void>> {
    return this.http.put<CommonResponse<void>>(`api/products`, payload);
  }

  deleteById(id: string): Observable<CommonResponse<void>> {
    return this.http.delete<CommonResponse<void>>(`api/products/${id}`);
  }

}
