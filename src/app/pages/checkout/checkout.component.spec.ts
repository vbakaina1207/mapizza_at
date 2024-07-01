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
import { ActivatedRoute, RouterModule, Routes, provideRouter } from '@angular/router';
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


// const docSpy = jasmine.createSpyObj('DocumentReference', ['get', 'update', 'delete', 'set']);
// docSpy.get.and.returnValue(of(orderData));
// docSpy.update.and.returnValue(Promise.resolve());
// docSpy.delete.and.returnValue(Promise.resolve());
// docSpy.set.and.returnValue(Promise.resolve());


// const collectionSpy = jasmine.createSpyObj('CollectionReference', ['get', 'add', 'doc', 'where']);
// collectionSpy.get.and.returnValue(of([orderData]));
// collectionSpy.add.and.returnValue(Promise.resolve({ id: '2' }));
// collectionSpy.doc.and.returnValue(docSpy);
// collectionSpy.where.and.returnValue(collectionSpy); 

// const firestoreStub = {
//   doc: (path: string) => docSpy,
//   collection: (path: string) => collectionSpy
// }

// const mockFirestore = {
//   collection: jasmine.createSpy('collection').and.returnValue(collectionSpy),
//   doc: jasmine.createSpy('doc').and.returnValue(docSpy),
// };

// const docRefSpy = jasmine.createSpyObj('DocumentReference', ['get', 'update', 'delete', 'set']);
// docRefSpy.get.and.returnValue(Promise.resolve({ exists: true, data: () => orderData }));
// docRefSpy.update.and.returnValue(Promise.resolve());
// docRefSpy.delete.and.returnValue(Promise.resolve());
// docRefSpy.set.and.returnValue(Promise.resolve());

// // Mock CollectionReference
// const collectionRefSpy = jasmine.createSpyObj('CollectionReference', ['get', 'add', 'doc', 'where']);
// collectionRefSpy.get.and.returnValue(Promise.resolve({ docs: [{ id: '1', data: () => orderData }] }));
// collectionRefSpy.add.and.returnValue(Promise.resolve({ id: '2' }));
// collectionRefSpy.doc.and.returnValue(docRefSpy);
// collectionRefSpy.where.and.returnValue(collectionRefSpy);

// // Mock Firestore
// const mockFirestore = {
//   collection: jasmine.createSpy('collection').and.returnValue(collectionRefSpy),
//   doc: jasmine.createSpy('doc').and.returnValue(docRefSpy),
// };

const docRefSpy = jasmine.createSpyObj('DocumentReference', ['get', 'update', 'delete', 'set']);
  docRefSpy.get.and.returnValue(of({ exists: true, data: () => orderData }));

  // Mock CollectionReference with a proper `doc` method
  const collectionRefSpy = jasmine.createSpyObj('CollectionReference', ['get', 'add', 'doc', 'where']);
  collectionRefSpy.doc.and.returnValue(docRefSpy);

  const docSnapshotStub = jasmine.createSpyObj('DocumentSnapshot', ['data']);

  // Mock Firestore
  // const mockFirestore = jasmine.createSpyObj('Firestore', ['collection']);
  // mockFirestore.collection.and.returnValue(collectionRefSpy);

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
  
//   const toastrServiceStub = {
//     success: (message: string) => { console.log('success', message); },
//     error: (message: string) => { console.log('error', message); },
//     // info: (message: string) => { console.log('info', message); },
//     // warning: (message: string) => { console.log('warning', message); }
// }

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

    // firestore = TestBed.inject(Firestore); 

    // // Set up mocks (assuming collection name is 'orders')
    // mockFirestore.collection.and.returnValue(collectionRefSpy);
    // collectionRefSpy.get.and.returnValue(of([docSnapshotStub]));
    // docSnapshotStub.data.and.returnValue(orderData); 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component data on ngOnInit', () => {
    // Call ngOnInit
    component.ngOnInit();
  
    // Expect total, basket, and order data to be populated
    expect(component.total).toBeDefined();
    // expect(component.basket.length).toBeGreaterThan(0); // Assuming some products in basket
    // expect(component.order.length).toBeGreaterThan(0); // Assuming some past orders
  });
  
  
  // it('should initialize component data on ngOnInit (success)', () => {
  //   (firestore.collection as jasmine.Spy).and.returnValue(collectionSpy);
  //   collectionSpy.get.and.returnValue(of(orderData));

  //   component.ngOnInit();

  //   expect(component.total).toBeDefined();
  //   expect(component.basket.length).toBeGreaterThan(0);
  //   expect(component.order.length).toBeGreaterThan(0);
  // });

  // it('should handle errors during ngOnInit', () => {
  //   (firestore.collection as jasmine.Spy).and.returnValue(collectionSpy);
  //   collectionSpy.get.and.returnValue(throwError('Firestore error'));

  //   spyOn(component, 'handleError').and.callFake(); // Spy on error handling

  //   component.ngOnInit();

  //   expect(component.handleError).toHaveBeenCalled();
  // });
});

 
 

  
  

  
 
  // it('should initialize the form with user data', () => {
  //   expect(component.orderForm).toBeDefined();
  //   expect(component.orderForm.value.name).toBe('John');
  //   expect(component.orderForm.value.phone).toBe('123-456-7890');
  //   expect(component.orderForm.value.email).toBe('john.doe@example.com');
  // });

  // it('should call createOrder on form submit', () => {
  //   component.orderForm.setValue({
  //     order_number: 1,
  //     uid: '12345',
  //     date_order: new Date(),
  //     status: false,
  //     total: 100,
  //     product: [],
  //     name: 'John',
  //     phone: '123-456-7890',
  //     email: 'john.doe@example.com',
  //     delivery_method: 'courier',
  //     payment_method: 'cod',
  //     cash: null,
  //     isWithoutRest: true,
  //     at_time: false,
  //     delivery_date: new Date().toISOString().split('T')[0],
  //     delivery_time: null,
  //     self_delivery_address: null,
  //     city: null,
  //     street: null,
  //     house: null,
  //     entrance: null,
  //     floor: null,
  //     flat: null,
  //     use_bonus: false,
  //     summa_bonus: null,
  //     promocode: null,      
  //     action: null,
  //     isCall: false,
  //     isComment: false,
  //     comment: null,
  //     summa: 100,
  //     discount: 'null',
  //     addres: null
  //   });
  //   component.addOrder();
  //   expect(orderServiceStub.createFirebase).toHaveBeenCalled();
  // });