/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdditionProductService } from './addition-product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: AdditionProduct', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdditionProductService],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should ...', inject([AdditionProductService], (service: AdditionProductService) => {
    expect(service).toBeTruthy();
  }));
});
