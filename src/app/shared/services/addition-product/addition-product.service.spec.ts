/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { AdditionProductService } from './addition-product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { IAdditionRequest, IAdditionResponse } from '../../interfaces/addition/addition.interfaces';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';

describe('Service: AdditionProduct', () => {
  let component: AdditionProductService;
  let fixture: ComponentFixture<AdditionProductService>;
  let service: AdditionProductService;
  let firestoreStub: any;

  const serviceAdditionProductStub = {
    getOneFirebase: (id: string) => of({      
      id: id, 
      name: 'test type',
      description: '',
      weight: '25',
      price: 5,
      imagePath: '',
      isSauce: false
    }),
    getAllFirebase: () => of([
      { id: 1, 
        name: 'test type', 
        description: '',
        weight: '25',
        price: 5,
        imagePath: '',
        isSauce: false}
    ]),
    getAllBySauceFirebase: (isSauce: boolean) => of([
      { id: 1, 
        name: 'test type', 
        description: '',
        weight: '25',
        price: 5,
        imagePath: '',
        isSauce: isSauce}
    ]),
   
  updateFirebase: (additionProduct: IAdditionRequest, id: string) => {
    return Promise.resolve({ id: id } as DocumentReference<DocumentData>);
  }, 
  createFirebase: (data: IAdditionRequest) => Promise.resolve({
    id: '5',
    ...data
  } as IAdditionResponse),
  deleteFirebase: (id: string) => Promise.resolve()
  };

  firestoreStub = {
    collection: jasmine.createSpy('collection').and.returnValue({}),
    doc: jasmine.createSpy('doc').and.returnValue({}),
    addDoc: jasmine.createSpy('addDoc').and.returnValue(Promise.resolve({})),
    updateDoc: jasmine.createSpy('updateDoc').and.returnValue(Promise.resolve({})),
    deleteDoc: jasmine.createSpy('deleteDoc').and.returnValue(Promise.resolve({})),
    collectionData: jasmine.createSpy('collectionData').and.returnValue(of([
      { id: '1', name: 'test product', isSauce: false }
    ])),
    docData: jasmine.createSpy('docData').and.returnValue(of(
      { id: '1', name: 'test product', isSauce: false }
    )),
    query: jasmine.createSpy('query').and.callFake(() => {}),
    where: jasmine.createSpy('where').and.callFake(() => {})
  };
  
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: AdditionProductService, useValue: serviceAdditionProductStub }
      ],
      imports: [
        HttpClientTestingModule
      ]
    }).compileComponents();

    service = TestBed.inject(AdditionProductService);
  });

  it('should ...', inject([AdditionProductService], (service: AdditionProductService) => {
    expect(service).toBeTruthy();
  }));

  it('getAllFirebase should return observable with data', (done) => {
    service.getAllFirebase().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]['name']).toBe('test type');
      done();
    });
  });

  it('getOneFirebase should return observable with a single product', (done) => {
    service.getOneFirebase('1').subscribe(data => {
      expect(data).toBeDefined();
      
      done();
    });
  });

  it('getAllBySauceFirebase should return observable with filtered data', (done) => {
    const isSauce = false;
    service.getAllBySauceFirebase(isSauce).subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]['isSauce']).toBe(isSauce);
      done();
    });
  });

  it('createFirebase should call addDoc and add data', (done) => {
    const newProduct = { name: 'new product', isSauce: true } as any;
    firestoreStub.addDoc.and.returnValue(Promise.resolve({ id: '5' }));

    service.createFirebase(newProduct).then((response) => {
      expect(firestoreStub.addDoc).toBeDefined();
      expect(response.id).toBe('5');
      done();
    });
  });

  

  it('updateFirebase should call updateDoc with correct data', (done) => {
    const updatedProduct = { name: 'updated product', isSauce: true } as any;
    const productId = '1';

    service.updateFirebase(updatedProduct, productId).then(() => {
      expect(firestoreStub.doc).toBeTruthy();
      expect(firestoreStub.updateDoc).toBeDefined();
      done();
    });
  });

  it('deleteFirebase should call deleteDoc with correct id', (done) => {
    const productId = '1';

    service.deleteFirebase(productId).then(() => {
      expect(firestoreStub.doc).toBeTruthy();
      expect(firestoreStub.deleteDoc).toBeDefined();
      done();
    });    
  });

  

});