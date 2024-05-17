import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { IDiscountResponse } from '../../interfaces/discount/discount.interface';
import { DiscountService } from './discount.service';

@Injectable({
  providedIn: 'root'
})
export class DiscountInfoResolver implements Resolve<IDiscountResponse> {

  constructor(private discountService: DiscountService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDiscountResponse> {
    return this.discountService.getOneFirebase((route.paramMap.get('id') as string)) as Observable<IDiscountResponse>;
  }
}
