import { TestBed } from '@angular/core/testing';

import { ProductInfoResolver } from './product-info.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable, of } from 'rxjs';
import { ProductService } from './product.service';
import { IProductResponse } from '../../interfaces/product/product.interface';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('ProductInfoResolver', () => {
  let productServiceMock: any;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(async () => {
    productServiceMock = {
      getOneFirebase: jasmine.createSpy('getOneFirebase').and.returnValue(of({} as IProductResponse))
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ]
    }).compileComponents();

    route = new ActivatedRouteSnapshot();
    state = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(ProductInfoResolver).toBeTruthy();
  });

  
});