/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CabinetComponent } from './cabinet.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { OrderService } from '../../shared/services/order/order.service';
import { Component } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';

@Component({
  selector: 'app-blank',
  template: '<p>Blank Component</p>'
})
class BlankComponent {}


const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'test', component: BlankComponent }
];


describe('CabinetComponent', () => {
  let component: CabinetComponent;
  let fixture: ComponentFixture<CabinetComponent>;

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
      declarations: [CabinetComponent],
      providers: [
        { provide: OrderService, useValue: orderServiceStub },
        provideRouter(routes)
      ],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot( routes ), 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CabinetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial isOpen as false', () => {
    expect(component.isOpen).toBeFalse();
  });

  it('should have initial title as "Personal data"', () => {
    expect(component.title).toBe('Personal data');
  });

  it('should toggle isOpen state when openMenu is called', () => {
    const initialState = component.isOpen;
    component.openMenu();
    expect(component.isOpen).toBe(!initialState);
  });

  it('should update title when closeMenu is called', () => {
    const mockEvent = { target: { value: 'New Title' } };
    component.closeMenu(mockEvent);
    expect(component.title).toBe('New Title');
  });
  
});