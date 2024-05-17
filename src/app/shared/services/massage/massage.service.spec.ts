/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MassageService } from './massage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: Message', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MassageService],
      imports: [
        HttpClientTestingModule
      ]
    });
  });

  it('should ...', inject([MassageService], (service: MassageService) => {
    expect(service).toBeTruthy();
  }));
});
