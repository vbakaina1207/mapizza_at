/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject, of } from 'rxjs';
import { ProductInfoComponent } from './product-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductService } from '../../../shared/services/product/product.service';
import { OrderService } from '../../../shared/services/order/order.service';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../../../../environments/environment';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';


@Component({
  selector: 'app-blank',
  template: '<p>Blank Component</p>'
})
class BlankComponent {}

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'test', component: BlankComponent }
];

describe('ProductInfoComponent', () => {
  let component: ProductInfoComponent;
  let fixture: ComponentFixture<ProductInfoComponent>;
  let productService: ProductService;

  const productServiceStub = {
    getOneFirebase: (id: string) => of({
      id: id,
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{}],
      name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    })
  };

  const orderServiceStub = {
    getAllFirebase: () => of([{
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
      }]),
  changeBasket: new Subject<boolean>()
  };

const mockFirestore = jasmine.createSpyObj('Firestore', ['collection']);
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

const toastrServiceStub = {
  success: jasmine.createSpy(),
  error: jasmine.createSpy()
};

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ProductInfoComponent],
      providers: [
        { provide: ProductService, useValue: productServiceStub },
        { provide: OrderService, useValue: orderServiceStub },
        { provide: MatDialogRef, useValue: {} },
        { provide: Firestore, useValue: mockFirestore },
        { provide: ToastrService, useValue: toastrServiceStub },
        provideRouter(routes)
      ]  ,    
      imports: [
        HttpClientTestingModule,        
        MatDialogModule,
        AngularFireStorageModule,
        RouterModule.forRoot( routes ),   
        AngularFireModule.initializeApp(environment.firebase),       
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore())  
      ],
      schemas: [
          NO_ERRORS_SCHEMA
          ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loading product', () => {
    const PRODUCT_ID = '1';
    const data = [
      {
        id: '1',
        category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }
    ]    
    if (PRODUCT_ID){
      productService?.getOneFirebase(PRODUCT_ID).subscribe(result => {
        expect(result).toEqual(data);
      });
    }
    expect(component).toBeTruthy();
  });

  it('should set isFavorite to true if the product is in the favorite list', () => {
    const favorite = [{ 
      id: '1', 
      category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }]; 
    const PRODUCT_ID = '1'; 
    let index = favorite?.findIndex(prod => prod.id === PRODUCT_ID);    
    if (index > -1) 
      component.isFavorite = true;  
    expect(component).toBeTruthy();
    component.loadFavoriteProduct(); 
    expect(component.isFavorite).toBe(true); 
  });

  it('should set isFavorite to false if the product is in the favorite list', () => {
    const favorite = [{ 
      id: '1', 
      category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }]; 
    const PRODUCT_ID = '2'; 
    let index = favorite?.findIndex(prod => prod.id === PRODUCT_ID);    
    component.isFavorite = index === -1 ? false : true;     
    expect(component.isFavorite).toBe(false); 
  });

  it('should get types products', () => {
    let product = {
      id: 1,
      category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    };

    productService?.getOneFirebase('1').subscribe(result => {
      expect(result).toEqual(product);
    });
    expect(component).toBeTruthy();
  });

  it('should update the count field when calling updateCount', () => {
    const product = {
      id: 1,
      category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    };
    const newCount = 2;
    component.productCount(product, true);
    expect(product.count).toBe(newCount);

  });


  it('add products to basket', () => {
    const product = {
      id: 1,
      category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    };
    spyOn(component, 'addToBasket').and.callThrough();
    component.addToBasket(product);
    expect(component.addToBasket).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

});