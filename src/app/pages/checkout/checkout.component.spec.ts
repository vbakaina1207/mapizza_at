/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutComponent } from './checkout.component';
import { Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Subject, of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { IOrderRequest } from '../../shared/interfaces/order/order.interface';
import { OrderService } from '../../shared/services/order/order.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { AccountService } from '../../shared/services/account/account.service';
import { ActivatedRoute, Router, RouterModule, Routes, provideRouter } from '@angular/router';
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
    updateFirebase: (product: Partial<IProductResponse>, id: string) => of({
      id: id,
      ...product
    })
  };

  

  


describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let firestore: Firestore;
  let mockRouter: any

  const orderData = [{
    id: '1',  
    order_number: 1,
    uid: 'user1',
    date_order: '12/12/2024',
    total: 589,
    status: false,
    product: [{
      id: 1,
      category: { id: 1, name: 'test category', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{}],
      name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }],
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
},
{
  id: '2',  
  order_number: 1,
  uid: 'user2',
  date_order: '12/12/2024',
  total: 589,
  status: false,
  product: [{
    id: 1,
    category: { id: 1, name: 'test category', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{}],
    name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
  }],
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
}];

const docRefSpy = jasmine.createSpyObj('DocumentReference', ['get', 'update', 'delete', 'set']);
  docRefSpy.get.and.returnValue(of({ exists: true, data: () => orderData }));

  // Mock CollectionReference with a proper `doc` method
  const collectionRefSpy = jasmine.createSpyObj('CollectionReference', ['get', 'add', 'doc', 'where']);
  collectionRefSpy.doc.and.returnValue(docRefSpy);

  const docSnapshotStub = jasmine.createSpyObj('DocumentSnapshot', ['data']);

  const mockFirestore = {
    collection: jasmine.createSpy('collection').and.returnValue(collectionRefSpy)
  };
  


  const orderServiceStub = {
    getAllFirebase: () => of(orderData),
    getUserFirebase: (uid: string) => {     
      const filteredOrders = orderData.filter(order => order.uid === uid);
      const sortedOrders = filteredOrders.sort((a, b) => {
        return new Date(b.date_order).getTime() - new Date(a.date_order).getTime();
      });
      return of(sortedOrders);
    },
    createFirebase: (order: IOrderRequest) => of([{ id: '1', ...order }]),
    changeBasket: new Subject<boolean>()
  };
  

  const toastServiceStub = {
    showSuccess: jasmine.createSpy(),
    showError: jasmine.createSpy()
  };

  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };
  

  const accountServiceStub = {
    isUserLogin$: new Subject<boolean>(),
    changeAddress: new Subject<boolean>(),
    changeCurrentUser: new Subject<boolean>(),
    changeFavorite: new Subject<boolean>(),
    searchAddress: new Subject<string>(),
    address$: new Subject<string>().asObservable(),
    updateAddress: jasmine.createSpy('updateAddress').and.callFake((address: string) => {
      accountServiceStub.searchAddress.next(address);
    }),
    zoneStatus$: new Subject<{ isGreenZone: boolean; isYellowZone: boolean }>(),
    setZoneStatus: jasmine.createSpy('setZoneStatus').and.callFake((isGreenZone: boolean, isYellowZone: boolean) => {
      accountServiceStub.zoneStatus$.next({ isGreenZone, isYellowZone });
    })
  };

  mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    events: new Subject<any>()
  };

  const mockOrderService = jasmine.createSpyObj('OrderService', ['createFirebase']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutComponent],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,  
        RouterModule.forRoot( routes ), 
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),     
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: OrderService, useValue: orderServiceStub },
        { provide: Firestore, useValue: mockFirestore },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: ToastService, useValue: {} },
        { provide: AccountService, useValue: accountServiceStub },
        provideRouter(routes),      
        
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;

    firestore = TestBed.inject(Firestore);

    mockFirestore.collection.and.returnValue(collectionRefSpy);
    collectionRefSpy.get.and.returnValue(of([docSnapshotStub]));
    docSnapshotStub.data.and.returnValue(orderData);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component data on ngOnInit', () => {
    component.ngOnInit();
    expect(component.total).toBeDefined();
  });
  
  it('should initialize form on init', () => {
    spyOn(component, 'initOrderForm');
    component.ngOnInit();
    expect(component.initOrderForm).toBeDefined();
  });

  it('should call loadBasket on initialization', () => {
    spyOn(component, 'loadBasket');
    component.ngOnInit();
    expect(component.loadBasket).toBeDefined();
  });

  it('should call getOrders on initialization', () => {
    spyOn(component, 'getOrders');
    component.ngOnInit();
    expect(component.getOrders).toBeDefined();
  });


  it('should load user from local storage', () => {
    const user = { address: [], bonus: 100 };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(user));
    component.loadUser();
    expect(component.currentUser).toEqual(user);
    expect(component.address).toEqual(user.address);
    expect(component.sum_bonus).toEqual(user.bonus);
  });

  it('should update basket on product count change', () => {
    const product = { id: 1, count: 1 } as any;
    spyOn(component, 'addToBasket');
    component.productCount(product, true);
    expect(component.addToBasket).toHaveBeenCalledWith(product, true);
  });

 it('should add order and update user profile', async () => {
    spyOn(component, 'removeAllFromBasket');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));
    spyOn(localStorage, 'setItem');
    const routerSpy = spyOn(component.router, 'navigate').and.stub();
    mockOrderService.createFirebase.and.returnValue(Promise.resolve({}));

    component.addOrder();

    expect(mockOrderService.createFirebase).toBeDefined();
    expect(component.removeAllFromBasket).toBeDefined();
    expect(localStorage.setItem).toHaveBeenCalled();
    expect(routerSpy).toBeDefined();
    expect(toastrServiceStub.success).toBeDefined();
  });



  it('should remove product from basket', () => {
    const product = { id: 1 } as any;
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([product]));
    spyOn(localStorage, 'setItem');
    component.removeFromBasket(product);
    expect(localStorage.setItem).toHaveBeenCalledWith('basket', JSON.stringify([]));
  });


});
