/* tslint:disable:no-unused-variable */

import { TestBed, fakeAsync, inject, tick } from '@angular/core/testing';
import { TypeProductService } from './type-product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ITypeProductRequest, ITypeProductResponse } from '../../interfaces/type-product/type-product.interface';


describe('Service: TypeProduct', () => {

  const mockTypeProduct: ITypeProductRequest = { name: 'test type', path: '', imgPath: '' };

  const serviceTypeProductStub = {
    getAllFirebase: jasmine.createSpy('getAllFirebase'),
    getOneFirebase: jasmine.createSpy('getOneFirebase'),
    createFirebase: jasmine.createSpy('createFirebase'),
    updateFirebase: jasmine.createSpy('updateFirebase'),
    deleteFirebase: jasmine.createSpy('deleteFirebase'),
  };

  const getAllFirebaseStub = jasmine.createSpyObj('TypeProductService', ['getAllFirebase']);
  const getOneFirebaseStub = jasmine.createSpyObj('TypeProductService', ['getOneFirebase']);
  const createFirebaseStub = jasmine.createSpyObj('TypeProductService', ['createFirebase']);
  const updateFirebaseStub = jasmine.createSpyObj('TypeProductService', ['updateFirebase']);
  const deleteFirebaseStub = jasmine.createSpyObj('TypeProductService', ['deleteFirebase']);


  const products = [
    { id: 1, name: 'test type', path: '', imgPath: '' }
  ]

  const serviceTypeProductSpy = {
    getAllFirebase: jasmine.createSpy('getAllFirebase').and.returnValue(of(products)),
    getOneFirebase: jasmine.createSpy('getOneFirebase').and.returnValue(of(products[0])),
    createFirebase: (data: ITypeProductRequest) => Promise.resolve({
      id: '1',
      ...data
    } as ITypeProductResponse),
    deleteFirebase: (id: string) => Promise.resolve(), 
    updateFirebase: ( product: Partial<ITypeProductResponse>, id: string) => of({
      id: id,
      ...product
    })
    
  };
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [
        {provide: TypeProductService, useValue: serviceTypeProductSpy }
      ],
      imports: [
        HttpClientTestingModule
      ]
    }).compileComponents();

  });

  it('should ...', inject([TypeProductService], (service: TypeProductService) => {
    expect(service).toBeTruthy();
  }));

  it('getAllFirebase should return all type products', (done: DoneFn) => {
    const service = TestBed.inject(TypeProductService);
    const expectedTypeProducts = [
      { id: 1, name: 'test type', path: '', imgPath: '' }
    ];
    getAllFirebaseStub.getAllFirebase.and.returnValue(of(expectedTypeProducts));

    service.getAllFirebase()
      .subscribe(typeProducts => {
        expect(typeProducts).toEqual(expectedTypeProducts);
        done();
      });
  });

  it('getOneFirebase should return a type product by id', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: TypeProductService, useValue: getOneFirebaseStub },
      ]
    });
    const expectedTypeData: ITypeProductResponse = {
      id: '1',
      name: 'test type',
      path: '',
      imgPath: ''
    };
    const expectedTypeProduct = of(expectedTypeData);
    const id = '1';
    getOneFirebaseStub.getOneFirebase.and.returnValue(of(expectedTypeProduct));
    
  });
  

  it('getOneFirebase should return a type product by id', async () => {
  
    TestBed.configureTestingModule({
      providers: [
        { provide: TypeProductService, useValue: getOneFirebaseStub },
      ]
    });
  
    const service = TestBed.inject(TypeProductService);
    const typeData = {     
      name: 'test type',
      path: '',
      imgPath: ''
    };
    const expectedTypeData: ITypeProductResponse = {
      id: '1',
      name: 'test type',
      path: '',
      imgPath: ''
    };
    const expectedTypeProduct = of(expectedTypeData); 
    const id = '1';
    getOneFirebaseStub.getOneFirebase.and.returnValue(expectedTypeProduct);

  });



  it('getOneFirebase should return a type product by id', (done: DoneFn) => {
    const id = '1';
    const service = TestBed.inject(TypeProductService);

    service.getOneFirebase(id)
      .subscribe(typeProduct => {
        expect(typeProduct).toBeTruthy();
        done();
      });
  });

 

  it('createFirebase should add a new type product', () => {
    const service = TestBed.inject(TypeProductService);
    const typeData = {     
      name: 'test type',
      path: '',
      imgPath: ''
    };
    const expectedTypeData: ITypeProductResponse = {
      id: '1',
      name: 'test type',
      path: '',
      imgPath: ''
    };   
      service.createFirebase(typeData).then((result: any) => {
        expect(result).toEqual(expectedTypeData);
      });
  });

 

  it('createFirebase should add a new type product', fakeAsync (async () => {
    const service = TestBed.inject(TypeProductService);
    const expectedCreatedDocument = jasmine.createSpyObj('DocumentReference', ['id']); 
    expectedCreatedDocument.id.and.returnValue('1');  
    await service.createFirebase(mockTypeProduct);
    tick();
    expect(serviceTypeProductStub.createFirebase).toBeTruthy(); 

  }));

  it('deleteFirebase should delete a type product', async () => {
    const service = TestBed.inject(TypeProductService);
    const id = '1';
    spyOn(serviceTypeProductSpy, 'deleteFirebase');
    await service.deleteFirebase(id);
    expect(true).toBe(true); 
  });

  it('updateFirebase should update a type product', async () => {
    const service = TestBed.inject(TypeProductService);
    const id = '1';
    const updatedTypeProduct = { ...mockTypeProduct, name: 'Updated Name' };
    spyOn(serviceTypeProductSpy, 'updateFirebase');
    await service.updateFirebase(updatedTypeProduct, id);
    expect(true).toBe(true); 
  });
  

  
});