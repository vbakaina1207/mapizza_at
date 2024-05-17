/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccountService } from './account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: Account', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountService],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should ...', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));
});
