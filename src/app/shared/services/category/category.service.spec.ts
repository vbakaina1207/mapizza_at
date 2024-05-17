/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Firestore } from '@angular/fire/firestore';
import { of } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

describe('Service: Category', () => {
  let httpTestingController: HttpTestingController;
  let categoryService: CategoryService;
  let firestoreSpy: jasmine.SpyObj<AngularFirestore>;
  
  beforeEach(() => {
      // const spy = jasmine.createSpyObj('AngularFirestore', ['collection', 'doc']);

    TestBed.configureTestingModule({
      providers: [CategoryService,
        { provide: Firestore, useValue:{} },
      ],
      imports: [
        HttpClientTestingModule,
        AngularFireStorageModule,        
      ]
    });
    httpTestingController = TestBed.get( HttpTestingController );
    categoryService = TestBed.get(CategoryService);

    // firestoreSpy = TestBed.inject(AngularFirestore) as jasmine.SpyObj<AngularFirestore>;
    // firestoreSpy.collection.and.returnValue({
    //   valueChanges: () => of([]),
    //   add: () => Promise.resolve({})
    // });
  });


  it('should ...', inject([CategoryService], (service: CategoryService) => {
    expect(service).toBeTruthy();
  }));
});
