/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FaqService } from './faq.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Firestore} from '@angular/fire/firestore';;
import { AngularFireModule } from '@angular/fire/compat';

import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';


describe('Service: Faq', () => {
  let firestoreMock: any;

  let component: FaqService;
  let fixture: ComponentFixture<FaqService>;
  const serviceStub = {
    getOneFirebase: (id: string) =>
      of({ id: id, name: '', email: '', phone:' ', stars: 4, comment: '', imagePath: '' , date_message: ''}),
  };

  beforeEach(async () => {
    
    firestoreMock = {
      collection: jasmine.createSpy('collection').and.returnValue({
        doc: jasmine.createSpy('doc').and.returnValue({
          valueChanges: jasmine.createSpy('valueChanges').and.returnValue(of({})),
          set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
          update: jasmine.createSpy('update').and.returnValue(Promise.resolve()),
          delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve())
        })
      })
    };
    await TestBed.configureTestingModule({
      providers: [
        { provide: FaqService, useValue: serviceStub },
        { provide: Firestore, useValue: firestoreMock },           
      ],
      imports: [
        HttpClientTestingModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule
         
      ]
    }).compileComponents();
  });

  it('should ...', inject([FaqService], (service: FaqService) => {
    expect(service).toBeTruthy();
  }));
});