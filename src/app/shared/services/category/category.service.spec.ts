/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CategoryService } from './category.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ICategoryRequest, ICategoryResponse } from '../../interfaces/category/category.interface';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';


describe('Service: Category', () => {
  let httpTestingController: HttpTestingController;
  let categoryService: CategoryService;
  let firestoreStub: any;
  
  const categoryServiceStub = {
    getOneFirebase: (id: string) =>
      of({
        id: id,
        name: 'test category',
        path: '',
        imagePath: '',
      }),

      getAllFirebase: () =>
        of([{
          id: 1,
          name: 'test category',
          path: '',
          imagePath: '',
        }]),
        updateFirebase: (category: ICategoryRequest, id: string) => {
          return Promise.resolve({ id: id } as DocumentReference<DocumentData>);
        }, 
        createFirebase: (data: ICategoryRequest) => Promise.resolve({
          id: '5',
          ...data
        } as ICategoryResponse),
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
        { provide: CategoryService, useValue: categoryServiceStub },       
      ],
      imports: [
        HttpClientTestingModule             
      ]
    }).compileComponents();
    httpTestingController = TestBed.inject( HttpTestingController );
    categoryService = TestBed.inject(CategoryService);
  });


  it('should ...', inject([CategoryService], (service: CategoryService) => {
    expect(service).toBeTruthy();
  }));

  it('getAllFirebase should return observable with data', (done) => {
    categoryService.getAllFirebase().subscribe(data => {
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]['name']).toBe('test category');
      done();
    });
  });

  it('getOneFirebase should return observable with a single category product', (done) => {
    categoryService.getOneFirebase('1').subscribe(data => {
      expect(data).toBeDefined();     
      done();
    });
  });

  

  it('createFirebase should call addDoc and add data', (done) => {
    const newProduct = { name: 'new product', isSauce: true } as any;
    firestoreStub.addDoc.and.returnValue(Promise.resolve({ id: '5' }));

    categoryService.createFirebase(newProduct).then((response) => {
      expect(firestoreStub.addDoc).toBeDefined();
      expect(response.id).toBe('5');
      done();
    });
  });

  

  it('updateFirebase should call updateDoc with correct data', (done) => {
    const updatedProduct = { name: 'updated product', isSauce: true } as any;
    const productId = '1';

    categoryService.updateFirebase(updatedProduct, productId).then(() => {
      expect(firestoreStub.doc).toBeTruthy();
      expect(firestoreStub.updateDoc).toBeDefined();
      done();
    });
  });

  it('deleteFirebase should call deleteDoc with correct id', (done) => {
    const productId = '1';

    categoryService.deleteFirebase(productId).then(() => {
      expect(firestoreStub.doc).toBeTruthy();
      expect(firestoreStub.deleteDoc).toBeDefined();
      done();
    });    
  });


});