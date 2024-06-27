/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IProductRequest, IProductResponse } from '../../interfaces/product/product.interface';
import { of } from 'rxjs';
import { ITypeAdditionResponse } from '../../interfaces/type-addition/type-addition.interfaces';

describe('Service: Product', () => {
  let httpTestingController: HttpTestingController;
  let productService: ProductService;


  const products = [
    {
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }
  ];

  const productServiceStub = {
    getAllFirebase: jasmine.createSpy('getAllFirebase').and.returnValue(of(products)),
    getOneFirebase: jasmine.createSpy('getOneFirebase').and.returnValue(of(products[0])),
    
    getAllByCategoryFirebase: () => of([{
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }]),
   
    createFirebase: (data: IProductRequest) => Promise.resolve({
      id: '1',
      ...data
    } as IProductResponse),
    deleteFirebase: (id: string) => Promise.resolve(), 
    updateFirebase: ( product: Partial<IProductResponse>, id: string) => of({
      id: id,
      ...product
    })
  };
  
  

  const product = {
    id: 1,
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{}],
    name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [
      { provide: ProductService, useValue: productServiceStub },
      ],
      imports: [ HttpClientTestingModule ]
    }).compileComponents();

    productService = TestBed.inject(ProductService);
    httpTestingController = TestBed.inject(HttpTestingController);
    
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should ...', inject([ProductService], (service: ProductService) => {
    expect(service).toBeTruthy();
  }));


  it('can test getAllFirebase', () => {
    const expectedData = [
      {
        id: '1',
        category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }
    ];
    
    productService.getAllFirebase().subscribe((response: any) => expect(response).toEqual(expectedData));
  });

  it('can test HttpClient.get1', () => {
    const data = [
      {
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }]
    productService.getAllFirebase().subscribe((response: any) => expect(response).toEqual(data));   
  });



  it('should send create request and return new product', () => {
    const productRequest: IProductRequest = {      
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1   
    };

    const expectedProduct: IProductResponse = {
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    };

    productService.createFirebase(productRequest).then((result: any) => {
      expect(result).toEqual(expectedProduct);
    });
   
  });

});