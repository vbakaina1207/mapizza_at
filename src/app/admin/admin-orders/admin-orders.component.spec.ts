/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminOrdersComponent } from './admin-orders.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { DocumentData, DocumentReference, Timestamp } from '@angular/fire/firestore';
import { OrderService } from '../../shared/services/order/order.service';
import { IOrderRequest, IOrderResponse } from '../../shared/interfaces/order/order.interface';
import { FormatDatePipe } from '../../shared/pipes/format-date.pipe';
import { LOCALE_ID } from '@angular/core';


describe('AdminOrdersComponent', () => {
  let component: AdminOrdersComponent;
  let fixture: ComponentFixture<AdminOrdersComponent>;
  let toastrService: ToastrService;
  let orderService: OrderService;
  let router: Router;

  const orderServiceStub = {
    getAllFirebase: () => of([
      {
        id: 1, 
      order_number: 1,
      uid: 'fhshgkszhbgkbjrhhr',
      date_order: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),
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
      name: "Viktoriia",
      phone: '+380667894561',
      email: 'user3@gmail.com',
      delivery_method: '',
      payment_method: '',
      cash: 0,
      isWithoutRest: false,
      at_time: false,
      delivery_date: new Date('2024-12-12T00:00:00Z'),
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
      discount: 0,
      summa: 1155,
      address: []
      }]), 
      getUserFirebase: (uid: string) => of([
        {
          id: 1, 
        order_number: 1,
      uid: uid,
      date_order: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),
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
      name: "Vikroriia",
      phone: '+380667894561',
      email: 'user3@gmail.com',
      delivery_method: '',
      payment_method: '',
      cash: 0,
      isWithoutRest: false,
      at_time: false,
      delivery_date: new Date('2024-12-12T00:00:00Z'),
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
      discount: 0,
      summa: 1155,
      address: []
      }
    ]),
    createFirebase: (order: IOrderRequest) => {
      return Promise.resolve({ id: '5' } as DocumentReference<DocumentData>);
    },
    updateFirebase: (order: IOrderRequest, id: string) => {
      return Promise.resolve({ id: id } as DocumentReference<DocumentData>);
    }, 
    deleteFirebase: (id: string) => of([{
      id: id,           
      order_number: 1,
      uid: 'fhshgkszhbgkbjrhhr',
      date_order: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),
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
      name: "Viktoriia",
      phone: '+380667894561',
      email: 'user3@gmail.com',
      delivery_method: '',
      payment_method: '',
      cash: 0,
      isWithoutRest: false,
      at_time: false,
      delivery_date: new Date('2024-12-12T00:00:00Z'),
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
      discount: 0,
      summa: 1155,
      address: []
    }]),
  };


  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  const mockOrders :  Array<IOrderResponse> = [
    {
      order_number: 1,
      uid: 'test order',
      date_order: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),
      total: 589,
      status: false,
      product: [{
        id: 1,
        category: { id: 1, name: 'test category', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }],
      name: "Vikroriia",
      phone: '+380667894561',
      email: 'user3@gmail.com',
      delivery_method: '',
      payment_method: '',
      cash: 0,
      isWithoutRest: false,
      at_time: false,
      delivery_date: new Date('2024-12-12T00:00:00Z'),
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
      address: [],
      id: '1',
      discount: 0
    }
  ];

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [
        AdminOrdersComponent,
        FormatDatePipe
      ],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Storage, useValue: {} },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: OrderService, useValue: orderServiceStub },
        { provide: LOCALE_ID, useValue: 'en-US' } 
      ]
    })
    .compileComponents();

    toastrService = TestBed.inject(ToastrService);
    orderService = TestBed.inject(OrderService);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with the correct controls', () => {
    component.initOrderForm();
    const form = component.orderForm;
    expect(form.contains('status')).toBeTrue();
    expect(form.get('status')?.valid).toBeFalse();  
  });


  it(`should return list of orders'`, () => {
    const fixture = TestBed.createComponent(AdminOrdersComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(OrderService);
    spyOn(service,"getAllFirebase").and.callFake (() => {
      return of([
        mockOrders
      ])
    });
    app.getOrders();
    expect(app.userOrders.length).toEqual(1);    
  });

  it('should populate userOrders with data from the service', fakeAsync(() => {
    component.getOrders();
    tick(); 
    expect(component.userOrders.length).toBe(1);
    expect(component.userOrders[0].name).toBe('Viktoriia');
  }));


  it('should display a success toast message on order update', fakeAsync( () => {
    component.userOrders = mockOrders;
  fixture.detectChanges();
  component.orderForm.patchValue({ status: true });
  component.changeOrder(component.userOrders[0]);
  tick(); 
  spyOn(orderService, 'updateFirebase');  
  orderService.updateFirebase(mockOrders[0], '1');       
  expect(orderService.updateFirebase).toHaveBeenCalled();  
  expect(toastrService.success).toHaveBeenCalled();
  }));

  it('should display a success toast message on order update', fakeAsync(() => {
    spyOn(orderService, 'updateFirebase').and.returnValue(Promise.resolve());

    component.userOrders = mockOrders;
    fixture.detectChanges();

    component.orderForm.patchValue({ status: true });
    component.changeOrder(component.userOrders[0]);
    tick(); 
    expect(orderService.updateFirebase).toHaveBeenCalled();    
    expect(toastrService.success).toHaveBeenCalled();
  }));

});