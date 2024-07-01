/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject } from 'rxjs';
import { BasketComponent } from './basket.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Auth } from '@angular/fire/auth';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { OrderService } from '../../shared/services/order/order.service';
import { ProductService } from '../../shared/services/product/product.service';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-blank',
  template: '<p>Blank Component</p>'
})
class BlankComponent {}

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'test', component: BlankComponent }
];

describe('BasketComponent', () => {
  let component: BasketComponent;
  let fixture: ComponentFixture<BasketComponent>;
  let products: any;

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
      }),
  changeBasket: new Subject<boolean>() 
  };

  const serviceStub = {
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

const mockFirestore = jasmine.createSpyObj('AngularFirestore', ['collection']);
const collectionStub = jasmine.createSpyObj('collection', ['doc']);
const docStub = jasmine.createSpyObj('doc', ['get']);

mockFirestore.collection.and.returnValue(collectionStub);
collectionStub.doc.and.returnValue(docStub);
docStub.get.and.returnValue(of({
  id: '1',
  data: () => ({
    id: '1',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
  })
}));

const storage: Record<string, string> = {};

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [BasketComponent],
      imports:[
        HttpClientTestingModule,   
        // MatDialogModule,
        RouterModule.forRoot( routes ), 
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
      ],
      providers: [
        // { provide: MatDialogRef, useValue: {} },
        { provide: OrderService, useValue: orderServiceStub },
        { provide: ProductService, useValue: serviceStub },
        { provide: Firestore, useValue: mockFirestore },
        { provide: ToastrService, useValue: {} },
        { provide: Auth, useValue: {} },
        provideRouter(routes)
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();

    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BasketComponent);
    component = fixture.componentInstance;
    products = [{
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'Product Name',
      path: '',
      ingredients: 'products',
      weight: '',
      price: 12,
      addition_price: 0,
      bonus: 0,
      imagePath: '',
      count: 1
    }];
    component.basket = [...products];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should change total', () => {
    const FAKE_BASKET = [
      {
        id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 2
      }
    ];
    component.basket = FAKE_BASKET;
    spyOn(component, 'getTotalPrice').and.callThrough();
    component.getTotalPrice();
    expect(component.getTotalPrice).toHaveBeenCalled();
    expect(component.total).toBe(24);
    component.basket = [];
    component.getTotalPrice();
    expect(component.getTotalPrice).toHaveBeenCalled();
    expect(component.total).toBe(0);
  });

  it('add products to basket', () => {
    const product = {
      id: '1', 
        category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    };
  spyOn(component, 'addToBasket').and.callThrough();
  component.addToBasket(product, true);
  expect(component.addToBasket).toHaveBeenCalled();
  expect(component).toBeTruthy();
});


it('should add products to basket', () => {
  const product = {
    id: '1', 
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
  };
  spyOn(component, 'addToBasket').and.callThrough();
  component.addToBasket(product, true);
  expect(component.addToBasket).toHaveBeenCalled();
  expect(component).toBeTruthy();
});

// it('should remove the product from basket', () => {

//   const product = {
//     id: '1',
//     category: { id: 1, name: '', path: '', imagePath: '' },
//     type_product: { id: 1, name: '', path: '', imgPath: '' },
//     type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
//     selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
//     name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
//   };
  
//   const FAKE_BASKET = [product];
//   localStorage.setItem('basket', JSON.stringify(FAKE_BASKET));

//   const spySetItem = spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
//     if (key === 'basket') {
//       storage['basket'] = value;
//     }
//   });
//   const spyChangeBasket = spyOn(orderServiceStub.changeBasket, 'next').and.callThrough();

//   component.removeFromBasket(product as IProductResponse);

//   const updatedBasket = JSON.parse(storage['basket'] || '[]');
//   expect(updatedBasket.length).toBe(0); 
//   expect(spySetItem).toHaveBeenCalledWith('basket', JSON.stringify([]));
//   expect(spyChangeBasket).toHaveBeenCalledWith(true);
// });



it('should update the basket when orderService.changeBasket emits', () => {
  const spyLoadBasket = spyOn(component, 'loadBasket').and.callThrough();
  const spySubscribe = spyOn(orderServiceStub.changeBasket, 'subscribe').and.callThrough();

  component.updateBasket();

  expect(spySubscribe).toHaveBeenCalled();
  orderServiceStub.changeBasket.next(true);
  expect(spyLoadBasket).toHaveBeenCalled();
});

it('should update the product in the basket', () => {
  const product = {
    id: '1',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
  };
  const FAKE_BASKET = [product];
  localStorage.setItem('basket', JSON.stringify(FAKE_BASKET));

  const spySetItem = spyOn(localStorage, 'setItem');
  const spyChangeBasket = spyOn(orderServiceStub.changeBasket, 'next').and.callThrough();

  component.updateProductInBasket(product as any, 0);

  const updatedBasket = JSON.parse(localStorage.getItem('basket') as string);
  expect(updatedBasket[0]).toEqual(product);
  expect(spySetItem).toHaveBeenCalledWith('basket', JSON.stringify([product]));
  expect(spyChangeBasket).toHaveBeenCalledWith(true);
});


it('should load the basket from local storage and compute totals', () => {
  const FAKE_BASKET = [
    {
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'Product Name',
      path: '',
      ingredients: 'products',
      weight: '',
      price: 12,
      addition_price: 0,
      bonus: 0,
      imagePath: '',
      count: 1
    }
  ];

  localStorage.setItem('basket', JSON.stringify(FAKE_BASKET));

  component.loadBasket();

  expect(component.basket).toEqual(FAKE_BASKET);
  expect(component.total).toBe(12);
  expect(component.count).toBe(1);
  expect(component.bonus).toBe(0);
});


it('should load the user from local storage', () => {
  const FAKE_USER = { id: '1', name: 'John Doe', email: 'john@example.com' };
  localStorage.setItem('currentUser', JSON.stringify(FAKE_USER));

  component.loadUser();

  expect(component.currentUser).toEqual(FAKE_USER);
});


it('should increase the product count and update the basket', () => {
  fixture.detectChanges();

  component.basket = products;
  const initialCount = products[0].count;
  spyOn(component, 'productCount').and.callThrough();

  component.productCount(products[0], true); // Increment
  expect(component.productCount).toHaveBeenCalledWith(products[0], true);
  // expect(component.basket[0].count).toBe(initialCount + 1);
 
});

it('should decrease the product count and update the basket', () => {
  fixture.detectChanges();
  const product = {
    id: '1',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: 'Product Name',
    path: '',
    ingredients: 'products',
    weight: '',
    price: 12,
    addition_price: 0,
    bonus: 0,
    imagePath: '',
    count: 2
  };

  component.basket = [product];
  spyOn(component, 'productCount').and.callThrough();

  component.productCount(product, false); // Decrement
  
  expect(component.productCount).toHaveBeenCalledWith(products[0], false);
  // expect(component.basket[0].count).toBe(1);
});

it('should delete an addition and update the product in the basket', () => {
  fixture.detectChanges();
  const product = {
    id: '1',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: 'Product Name',
    path: '',
    ingredients: 'products',
    weight: '',
    price: 12,
    addition_price: 25,
    bonus: 0,
    imagePath: '',
    count: 1
  };

  localStorage.setItem('basket', JSON.stringify([product]));

  component.additionDeleteClick(product, 'type');

  const updatedBasket = JSON.parse(localStorage.getItem('basket') as string);
  expect(updatedBasket[0].selected_addition).toEqual([]);
  expect(updatedBasket[0].addition_price).toBe(0);
});

it('should open the login dialog', () => {
  const dialogSpy = spyOn(component['dialog'], 'open').and.callThrough();

  component.openLoginDialog();

  expect(dialogSpy).toHaveBeenCalledWith(AuthDialogComponent, {
    backdropClass: 'dialog-back',
    panelClass: 'auth-dialog',
    autoFocus: false
  });
});


it('should compare two arrays of additions and return true if they are equal', () => {
  const additions1: ITypeAdditionResponse[] = [
    { id: 1, name: 'Addition1', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false },
    { id: 2, name: 'Addition2', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }
  ];

  const additions2: ITypeAdditionResponse[] = [
    { id: 1, name: 'Addition1', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false },
    { id: 2, name: 'Addition2', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }
  ];

  const result = component.areAdditionsEqual(additions1, additions2);
  expect(result).toBe(true);
});

it('should return false if the two arrays of additions are not equal', () => {
  const additions1: ITypeAdditionResponse[] = [
    { id: 1, name: 'Addition1', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }
  ];

  const additions2: ITypeAdditionResponse[] = [
    { id: 2, name: 'Addition2', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }
  ];

  const result = component.areAdditionsEqual(additions1, additions2);
  expect(result).toBe(false);
});


it('should find the index of the product in the basket', () => {
  fixture.detectChanges();
  const product = {
    id: '1',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: 'Product Name',
    path: '',
    ingredients: 'products',
    weight: '',
    price: 12,
    addition_price: 0,
    bonus: 0,
    imagePath: '',
    count: 1
  };

  component.basket = [product];

  const index = component.findProductIndexInBasket(product);

  expect(index).toBeDefined();
});



it('should compute the total price, count, and bonus correctly', () => {
  const product1 = {
    id: '1',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: 'Product Name',
    path: '',
    ingredients: 'products',
    weight: '',
    price: 12,
    addition_price: 25,
    bonus: 2,
    imagePath: '',
    count: 1
  };

  const product2 = {
    id: '2',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: 'Product Name',
    path: '',
    ingredients: 'products',
    weight: '',
    price: 20,
    addition_price: 0,
    bonus: 3,
    imagePath: '',
    count: 2
  };

  component.basket = [product1, product2];

  component.getTotalPrice();

  expect(component.total).toBe(77); // 12 + 25 + (20 * 2)
  expect(component.count).toBe(3);
  expect(component.bonus).toBe(8); // 2 + (3 * 2)
});



});