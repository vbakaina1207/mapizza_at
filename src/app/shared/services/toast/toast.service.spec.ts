/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

describe('Service: Toast', () => {
  let toastService: ToastService;
  let toastrService: jasmine.SpyObj<ToastrService>;
  const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

  const toastrServiceStub = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error')
  };

  

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: ToastService, useClass: ToastService },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ],
      imports: [
        HttpClientTestingModule
      ]
    }).compileComponents();

    toastService = TestBed.inject(ToastService);   
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>; 

    toastrService.success.calls.reset();
    toastrService.error.calls.reset();
    
  });

  it('should ...', inject([ToastService], (service: ToastService) => {
    expect(service).toBeTruthy();
  }));

  it('should call ToastrService.success with correct parameters', () => {
    const title = 'Success Title';
    const message = 'Success Message';
   
    toastService.showSuccess(title, message);

    expect(toastrService.success).toHaveBeenCalledWith(
      message,
      title,
      jasmine.objectContaining({
        positionClass: 'toast-center-center',
        timeOut: 5000,
        easing: 'ease-in',
        easeTime: 1000
      })
    );
  });

  it('should call ToastrService.error with correct parameters', () => {
    const title = 'Error Title';
    const message = 'Error Message';
    
    toastService.showError(title, message);
    
    expect(toastrService.error).toHaveBeenCalledWith(
      message,
      title,
      jasmine.objectContaining({
        positionClass: 'toast-center-center',
        timeOut: 5000,
        easing: 'ease-in',
        easeTime: 1000
      })
    );
  });


  it('should call ToastrService.success with correct parameters', () => {
    const title = 'Success Title';
    const message = 'Success Message';
    toastService.showSuccess(title, message); 
  
    expect(toastrService.success).toHaveBeenCalledWith(
      message,
      title,
      jasmine.objectContaining({
        positionClass: 'toast-center-center',
        timeOut: 5000,
        easing: 'ease-in',
        easeTime: 1000
      })
    );
  });

});