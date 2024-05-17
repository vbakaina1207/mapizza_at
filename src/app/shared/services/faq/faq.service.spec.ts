/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FaqService } from './faq.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Firestore, addDoc, collectionData } from '@angular/fire/firestore';;
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';

import { FirebaseApp, FirebaseAppModule, getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from 'src/environments/environment';
import * as firebase from 'firebase/compat';
import { Auth } from '@angular/fire/auth';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';

describe('Service: Faq', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FaqService,
        { provide: Firestore, useValue: {} },
        { provide: Auth, useValue: {} },
        // AngularFirestoreCollection,
        // { provide: AngularFirestoreCollection, useValue: {Document} },
        // { provide: addDoc, useValue: {} },
        // { provide: collectionData, useValue: {}}
      ],
      imports: [
        HttpClientTestingModule,
        
      
        AngularFireModule,
        // AngularFireStorageModule,
        // AngularFireAuthModule
      
      ]
    });
  });

  it('should ...', inject([FaqService], (service: FaqService) => {
    expect(service).toBeTruthy();
  }));
});
