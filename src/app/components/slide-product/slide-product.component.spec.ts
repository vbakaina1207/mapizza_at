/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SlideProductComponent } from './slide-product.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ProductService } from '../../shared/services/product/product.service';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';
import { OrderService } from '../../shared/services/order/order.service';

describe('SlideProductComponent', () => {
  let component: SlideProductComponent;
  let fixture: ComponentFixture<SlideProductComponent>;
  let productService: ProductService;
  

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


const toastrServiceStub = {
  success: jasmine.createSpy(),
  error: jasmine.createSpy()
};
  
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [SlideProductComponent],
      imports:[
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: OrderService, useValue: orderServiceStub },
        { provide: ProductService, useValue: serviceStub },
        { provide: Firestore, useValue: mockFirestore },
        { provide: ToastrService, useValue: toastrServiceStub },
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideProductComponent);
    component = fixture.componentInstance;        
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loading products', () => {
    const data = [
      {       
        id: '1', 
        category: { id: 1, name: 'pizza', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }
    ]
    let categoryName = 'pizza';
    const productTypeName = '';
    component.categoryName = categoryName;
    component.productTypeName = productTypeName;
    component.loadProducts();
    productService?.getAllByCategoryFirebase(categoryName).subscribe(result => {
      expect(result).toEqual(data);
    });
    if (productTypeName){
      productService?.getAllByProductTypeFirebase(productTypeName, categoryName).subscribe(result => {
        expect(result).toEqual(data);
      });
    }
    expect(component).toBeTruthy();
  });

  it('should decrease product count', () => {
    const product: IProductResponse = {
      id: '1',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '',
    count: 2
    };
    component.productCount(product, false);
    expect(product.count).toBe(1);
  });

  it('should increase product count', () => {
    const product: IProductResponse = {
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: '', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', 
      count: 1
    };
    component.productCount(product, true);
    expect(product.count).toBe(2);
  });

  it('should add product to basket and update basket', fakeAsync(() => {
    const component: SlideProductComponent = TestBed.createComponent(SlideProductComponent).componentInstance;
   
    const product: IProductResponse = {
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', 
      count: 1
    };
    const event: any = {
      target: { innerText: '', nextSibling: { classList: { add: () => {}, remove: () => {} } } , classList: { add: () => {}, remove: () => {}  }}
    };
    spyOn(component.toastr, 'showSuccess'); 
    spyOn(event.target.nextSibling.classList, 'add'); 
    spyOn(event.target.classList, 'add'); 

    localStorage.clear();
    component.basket  = [];
      
    expect(component.basket.length).toEqual(0);
    component.addToBasket(product, event);

    tick(2000);
 
    expect(event.target.nextSibling.classList.add).toHaveBeenCalledWith('hide'); 
    expect(event.target.classList.add).toHaveBeenCalledWith('primary'); 
    expect(component.toastr.showSuccess).toHaveBeenCalled(); 
    expect(component.basket.length).toEqual(1); 
    expect(product.count).toEqual(1);
  }));

});