/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IProductRequest, IProductResponse } from '../../interfaces/product/product.interface';
import { ProductComponent } from '../../../pages/product/product.component';
import { of } from 'rxjs';

describe('Service: Product', () => {
  let httpTestingController: HttpTestingController;
  let productService: ProductService;
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
 


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: jasmine.createSpyObj('ProductService', ['getAllByCategoryFirebase', 'getAllFirebase']) }
      ],
      imports: [ HttpClientTestingModule ]
    });

    httpTestingController = TestBed.get( HttpTestingController );
    productService = TestBed.get(ProductService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should ...', inject([ProductService], (service: ProductService) => {
    expect(service).toBeTruthy();
  }));


  it('should load products on init', () => {
    // Mock productService methods
    (productService.getAllByCategoryFirebase as jasmine.Spy).and.returnValue(of([])); // Mock to return an empty observable

    component.ngAfterViewInit();
    expect(component.userProducts.length).toBe(0); // Assert products are empty
  });

  /* it('can test HttpClient.get', () => {
    const data = [
      {
      id: 1,
        price_old: 100,
      imagePath: '',
      count: 5
    },
      {
        id: 2,
        price_old: 200,
        imagePath: '',
        count: 15
      }]
    productService.getAllFirebase().subscribe((response: any) => expect(response).toBe(data));
    const req = httpTestingController.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });



  it('should send create request and return new product', () => {
    const productRequest: IProductRequest = {
      category: {
        id: 1,
        name: 'rol',
        path: 'rol',
        imagePath: 'www.monosuschi',
      },
      type_product: {
        id: 1,
        name: 'set',
        path: 'set',
        imgPath: 'www.monosuschi',
      },
      type_addition: [{
          id: 1,
          name: 'souce',
          path: 'souce',
          description: 'souce',
          weight: '20',
          price: 50,
          imagePath: 'souce',
          isSauce: true,
        }],
      selected_addition: [{
          id: 1,
          name: 'souce',
          path: 'souce',
          description: 'souce',
          weight: '20',
          price: 50,
          imagePath: 'souce',
          isSauce: true,
        }],
      name: 'california',
      path: 'california',
      ingredients: 'fish',
      weight: '120',
      price: 200,
      addition_price: 300,
      bonus: 8,
      imagePath: 'www.monosushi',
      count: 2,      
    };

    const expectedProduct: IProductResponse = {
      id: 3,
      category: {
        id: 1,
        name: 'rol',
        path: 'rol',
        imagePath: 'www.monosuschi',
      },
      type_product: {
        id: 1,
        name: 'set',
        path: 'set',
        imgPath: 'www.monosuschi',
      },
      type_addition: [{
          id: 1,
          name: 'souce',
          path: 'souce',
          description: 'souce',
          weight: '20',
          price: 50,
          imagePath: 'souce',
          isSauce: true,
        }],
      selected_addition: [{
          id: 1,
          name: 'souce',
          path: 'souce',
          description: 'souce',
          weight: '20',
          price: 50,
          imagePath: 'souce',
          isSauce: true,
        }],
      name: 'california',
      path: 'california',
      ingredients: 'fish',
      weight: '120',
      price: 200,
      addition_price: 300,
      bonus: 8,
      imagePath: 'www.monosushi',
      count: 2
    };

    productService.createFirebase(productRequest).then((result: any) => {
      expect(result).toEqual(expectedProduct);
    });

    const expectedUrl = 'http://localhost:3000/products';
    const testRequest = httpTestingController.expectOne(expectedUrl);

    expect(testRequest.request.method).toEqual('POST');
    expect(testRequest.request.body).toEqual(productRequest);

    testRequest.flush(expectedProduct);
  });
 */
});
