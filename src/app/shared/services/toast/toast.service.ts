import { Injectable } from '@angular/core';
import { bottom, left } from '@popperjs/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

constructor(private toastr: ToastrService ) { }

  showSuccess(title: any, massage: any) {
    this.toastr.success(massage, title, {
      positionClass: 'toast-center-center',
      timeOut: 5000,
      easing: 'ease-in',
      easeTime: 1000
    });
  }

  showError(title: any, massage: any) {
    this.toastr.error(massage, title, {
      positionClass: 'toast-center-center',
      timeOut: 5000,
      easing: 'ease-in',
      easeTime: 1000
    });
  }

}
