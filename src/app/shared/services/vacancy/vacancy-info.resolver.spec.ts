import { TestBed } from '@angular/core/testing';

import { VacancyInfoResolver } from './vacancy-info.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('VacancyInfoResolver', () => {
  let resolver: VacancyInfoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    resolver = TestBed.inject(VacancyInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
