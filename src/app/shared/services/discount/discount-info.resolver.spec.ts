import { TestBed } from '@angular/core/testing';

import { DiscountInfoResolver } from './discount-info.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DiscountService } from './discount.service';
import { IDiscountResponse } from '../../interfaces/discount/discount.interface';
import { of } from 'rxjs';

describe('DiscountInfoResolver', () => {
    let discountServiceMock: any;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(async () => {
    discountServiceMock = {
      getOneFirebase: jasmine.createSpy('getOneFirebase').and.returnValue(of({} as IDiscountResponse))
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: DiscountService, useValue: discountServiceMock }
      ]
    }).compileComponents();

    route = new ActivatedRouteSnapshot();
    state = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(DiscountInfoResolver).toBeTruthy();
  });

});