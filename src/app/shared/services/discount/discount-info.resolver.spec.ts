import { TestBed } from '@angular/core/testing';

import { DiscountInfoResolver } from './discount-info.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DiscountInfoResolver', () => {
  let resolver: DiscountInfoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    resolver = TestBed.inject(DiscountInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
