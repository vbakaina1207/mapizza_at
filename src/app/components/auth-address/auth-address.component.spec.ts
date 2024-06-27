/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { AuthAddressComponent } from './auth-address.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../shared/services/account/account.service';


describe('AuthAddressComponent', () => {
  let component: AuthAddressComponent;
  let fixture: ComponentFixture<AuthAddressComponent>;
  let toastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
  let accountService = jasmine.createSpyObj('AccountService', ['loadUser', 'getAddress', 'updateAddress']);

  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AuthAddressComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        AngularFireStorageModule
      ],
      providers: [
        { provide: Auth, useValue: {} },
        { provide: Firestore, useValue: {} },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: AccountService, useValue: accountService},
      ]
    })
    .compileComponents();

     toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    accountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly in edit mode', () => {
    component.isEdit = true;
    component.i = 1;
    component.dataUser = [
      { typeAddress: 'home', city: 'New York', street: 'School street', house: '25a', entrance: null, floor: 1, flat: 5},
      { typeAddress: 'work', city: 'London', street: 'Mosart street', house: '5', entrance: null, floor: 3, flat: 15},
    ];
  
    spyOn(component, 'initAuthFormAddress').and.callThrough();
    component.initAuthFormAddress();
    expect(component.initAuthFormAddress).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });
  
  it('should call toastr success method and update address', async () => {
    spyOn(component, 'updateAddress').and.resolveTo();
    component.authFormAddress.setValue({
      typeAddress: 'work',
      city: 'London',
      street: 'Mosart street',
      house: '5',
      entrance: null,
      floor: 3,
      flat: 15
    });
  
    component.addAddress();  
    expect(component.isEdit).toBeFalse();   
  });
  
  it('should call toastr error method when updateAddress fails', async () => {
    spyOn(component, 'updateAddress').and.rejectWith(new Error('Update failed'));
    component.authFormAddress.setValue({
      typeAddress: 'work',
      city: 'London',
      street: 'Mosart street',
      house: '5',
      entrance: null,
      floor: 3,
      flat: 15
    });
  
    spyOn(component, 'addAddress').and.callThrough();
    component.addAddress();
    expect(component.isEdit).toBeFalse();  
    expect(component).toBeTruthy();
  });
  
});