/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { OrderService } from './order.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Firestore } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { of } from 'rxjs';
import { IProductResponse } from '../../interfaces/product/product.interface';
import { ITypeAdditionResponse } from '../../interfaces/type-addition/type-addition.interfaces';
import { ProductService } from '../product/product.service';
import { ToastrService } from 'ngx-toastr';

describe('Service: Order', () => {

  let httpTestingController: HttpTestingController;
  let orderService: OrderService;
  
  const productServiceStub = {
    getOneFirebase: (id: string) => of({
      id: id,
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{}],
      name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }),
    getAllByCategoryFirebase: () => of([{
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }]),
    getAllFirebase: () => of([
      {
        id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }
    ]),    
    updateFirebase: ( product: Partial<IProductResponse>, id: string) => of({
      id: id,
      ...product
    })
  };
  

  const orderServiceStub = {
    getAllFirebase: () => of({
      order_number: 1,
      uid: 'fhshgkszhbgkbjrhhr',
      date_order: '12/12/2024',
      total: 589,
      status: false,
      product: {
        id: 1,
        category: { id: 1, name: 'test category', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{}],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      },
      name: "Ivan",
  phone: '+380667894561',
  email: 'ivan@gmail.com',
  delivery_method: '',
  payment_method: '',
  cash: 0,
  isWithoutRest: false,
  at_time: false,
  delivery_date: '',
  delivery_time: '',
  self_delivery_address: '',
  city: 'Lviv',
  street: 'school',
  house: '25',
  entrance: '',
  flor: 4,
  flat: '5',
  use_bonus: false,
  summa_bonus: 0,
  promocode: '',
  action: '',
  isCall: false,
  isComment: false,
  comment: '',
  summa: 1155,
  address: []
      })
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: OrderService, useValue: orderServiceStub },
        { provide: ProductService, useValue: productServiceStub },
        { provide: Firestore, useValue: {} },
        { provide: ToastrService, useValue: {} },
      ],
      imports: [
        HttpClientTestingModule,
        AngularFireStorageModule,
        
      ]
    }).compileComponents();

    orderService = TestBed.inject(OrderService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should ...', inject([OrderService], (service: OrderService) => {
    expect(service).toBeTruthy();
  }));
});
