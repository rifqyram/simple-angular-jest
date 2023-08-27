import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private readonly loadingService: LoadingService,
    private readonly router: Router) {
    this.handleHttpError = this.handleHttpError.bind(this);
  }

  handleHttpError(error: any, route: string = '/'): Observable<any> {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          this.swalError(undefined, this.mapToListHtml(error.error.errors));
          break;
        case 404:
          if (error.error) {
            this.swalError(undefined, error.error.errors);
            this.router.navigate([route]);
          }
          break;
        case 504:
          this.swalError(undefined, "Internal Server Error")
          break;
        default:
          if (error.error.errors) {
            this.swalError(undefined, error.error.errors)
            break;
          }
          this.swalError(undefined, error.error);
      }
    }

    this.loadingService.hideLoading();
    return throwError(() => error);
  }

  mapToListHtml(obj: any): string {
    let result = '<ul">';

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result += `<li>${obj[key]}</li>`;
      }
    }

    result += '</ul>';
    return result;
  }

  swalSuccess(message: string) {
    Swal.fire({
      title: 'Success',
      text: message,
      icon: 'success',
      confirmButtonColor: '#0d6efd'
    })
  }

  async swalConfirm(message: string, execute: () => void) {
    const response = await Swal.fire({
      icon: 'info',
      title: 'Confirm',
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Remove',
      confirmButtonColor: '#dc3545'
    });

    if (response.isConfirmed) {
      execute();
      this.swalSuccess('Success Removed')
    }
  }

  swalError(title: string = 'An Error Occurred!', errors: string) {
    Swal.fire({
      title: title,
      html: errors,
      icon: 'error',
      confirmButtonColor: '#0d6efd'
    })
  }
}
