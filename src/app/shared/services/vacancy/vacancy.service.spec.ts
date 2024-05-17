/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VacancyService } from './vacancy.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CollectionReference, Firestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Auth } from '@angular/fire/auth';
import { AngularFirestoreCollection } from '@angular/fire/compat/firestore';

describe('Service: Vacancy', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VacancyService,
        { provide: Firestore, useValue: {} },
        // AngularFirestoreCollection,
        
      ],
      imports: [
        HttpClientTestingModule,        
        AngularFireStorageModule,
        AngularFireModule,
        
      ]
    });
  });

  it('should ...', inject([VacancyService], (service: VacancyService) => {
    expect(service).toBeTruthy();
  }));
});
