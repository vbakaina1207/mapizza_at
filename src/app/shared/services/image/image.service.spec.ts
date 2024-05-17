/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImageService } from './image.service';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Storage } from '@angular/fire/storage';

describe('Service: Image', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AngularFireStorageModule
      ],
      providers: [
        ImageService  ,
        { provide: Storage, useValue: {} }
      ]
    });
  });

  it('should ...', inject([ImageService], (service: ImageService) => {
    expect(service).toBeTruthy();
  }));
});
