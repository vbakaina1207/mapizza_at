import { Injectable, inject } from '@angular/core';
import {
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { IProductResponse } from '../../interfaces/product/product.interface';
import { ProductService } from './product.service';

/* @Injectable({
  providedIn: 'root'
}) */
/* export class ProductInfoResolver implements Resolve<IProductResponse> {

  constructor(private productService: ProductService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProductResponse> {
    return this.productService.getOneFirebase((route.paramMap.get('id') as string)) as Observable<IProductResponse>;
  }

} */

export const ProductInfoResolver: ResolveFn<Observable<IProductResponse>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
  ) => {
    const id = route.paramMap.get('id');
    if (id) {
      return inject(ProductService).getOneFirebase(id) as Observable<IProductResponse>;
    }
    return of({} as IProductResponse);
}
