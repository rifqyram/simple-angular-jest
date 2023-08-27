import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UtilService } from './util.service';
import { LoadingService } from './loading.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { error } from 'console';

describe('UtilService', () => {
  let service: UtilService;
  let loadingService: any;
  let router: Router;

  beforeEach(() => {
    loadingService = {
      hideLoading: jest.fn(),
    }
    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoadingService,
          useValue: loadingService,
        }
      ]
    });

    router = TestBed.inject(Router);
    service = TestBed.inject(UtilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle 400 error with error messages', () => {
    const mockSwalError = jest.spyOn(service, 'swalError');
    const errorResponse = new HttpErrorResponse({ status: 400, error: { errors: { productId: 'Bad Request' } } });

    service.handleHttpError(errorResponse);

    expect(mockSwalError).toHaveBeenCalled();
  });

  it('should handle 404 error with error messages', () => {
    const mockSwalError = jest.spyOn(service, 'swalError');
    const errorResponse = new HttpErrorResponse({ status: 404, error: { error: { errors: 'Not Found' } } });

    service.handleHttpError(errorResponse);

    expect(mockSwalError).toHaveBeenCalled();
  });

  it('should handle 504 error with error messages', () => {
    const mockSwalError = jest.spyOn(service, 'swalError');
    const errorResponse = new HttpErrorResponse({ status: 504, error: { error: { errors: 'Internal Server' } } });

    service.handleHttpError(errorResponse);

    expect(mockSwalError).toHaveBeenCalled();
  });

  it('should handle default error with error messages', () => {
    const mockSwalError = jest.spyOn(service, 'swalError');
    const errorResponse = new HttpErrorResponse({ status: 500, error: { error: { errors: 'Internal Server' } } });

    service.handleHttpError(errorResponse);

    expect(mockSwalError).toHaveBeenCalledWith(undefined, errorResponse.error.errors);
  });

  it('should handle another default error with error messages', () => {
    const mockSwalError = jest.spyOn(service, 'handleHttpError');
    const errorResponse = new HttpErrorResponse({ status: 500, error: { error: 'Internal Server' } });

    service.handleHttpError(errorResponse);

    expect(mockSwalError).toHaveBeenCalled();
  });

  it('should return list element when mapToListHtml called', () => {
    let obj: any = {
      email: 'invalid email',
      password: 'invalid password',
    };

    let stringResult = '<ul">';

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        stringResult += `<li>${obj[key]}</li>`;
      }
    }

    stringResult += '</ul>';

    const result = service.mapToListHtml(obj);

    expect(result).toEqual(stringResult);
  });

  it('should call swalSuccess with the correct message', () => {
    const fireSuccessSpy = jest.spyOn(Swal, 'fire');

    const message = 'Success message';
    service.swalSuccess(message);

    expect(fireSuccessSpy).toHaveBeenCalled();
  });

  it('should execute the success function on confirmed', async () => {
    const mockResponse: SweetAlertResult<unknown> = {
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    };

    const mockSwalFire = jest.spyOn(Swal, 'fire').mockResolvedValue(mockResponse);
    const mockExecute = jest.fn();
    const mockSwalSuccess = jest.spyOn(service, 'swalSuccess');

    await service.swalConfirm('Test Message', mockExecute);

    expect(mockSwalFire).toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalled();
    expect(mockSwalSuccess).toHaveBeenCalledWith('Success Removed');
  });

  it('should call swalError with the correct message', () => {
    const fireErrorSpy = jest.spyOn(Swal, 'fire');

    const message = 'Error message';
    service.swalError(undefined, message);

    expect(fireErrorSpy).toHaveBeenCalled();
  });

});




