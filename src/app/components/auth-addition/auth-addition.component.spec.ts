/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthAdditionComponent } from './auth-addition.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Auth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AdditionProductService } from '../../shared/services/addition-product/addition-product.service';
import { ProductService } from '../../shared/services/product/product.service';
import { OrderService } from '../../shared/services/order/order.service';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';


describe('AuthAdditionComponent', () => {
  let component: AuthAdditionComponent;
  let fixture: ComponentFixture<AuthAdditionComponent>;
  let addProductService: AdditionProductService;
  let productService: ProductService;
  
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
    ])
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

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AuthAdditionComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        AngularFireStorageModule
      ],
      providers: [
        { provide: Auth, useValue: {} },
        { provide: ToastrService, useValue: {} },
        { provide: AdditionProductService, useValue: serviceAdditionProductStub },
        { provide: OrderService, useValue: orderServiceStub },
        { provide: ProductService, useValue: productServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAdditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should return empty list of type products'`, () => {
    const addProduct: ITypeAdditionResponse = {
      id: 1,
      name: 'test type',
      description: '',
      weight: '25',
      price: 5,
      imagePath: '',
      isSauce: false,
      path: ''
    };
    component.loadTypeAddition();
    addProductService?.getAllFirebase().subscribe((response: any) => expect(response).toBe(addProduct));
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

 
});