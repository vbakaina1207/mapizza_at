/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TypeProductService } from './type-product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: TypeProduct', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TypeProductService],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should ...', inject([TypeProductService], (service: TypeProductService) => {
    expect(service).toBeTruthy();
  }));
});
