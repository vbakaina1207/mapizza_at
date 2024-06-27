/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Storage } from '@angular/fire/storage';
import { PasswordComponent } from './password.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AngularFireModule } from '@angular/fire/compat';

describe('PasswordComponent', () => {
  let component: PasswordComponent;
  let fixture: ComponentFixture<PasswordComponent>;
  // let router: Router;

  const mockAuth = {
    currentUser: {
      updatePassword: jasmine.createSpy('updatePassword').and.callFake(() => Promise.resolve())
    }
  };
  
  const toastrServiceStub = jasmine.createSpyObj('ToastrService', ['showSuccess', 'showError']);

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [PasswordComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatDialogModule,
        AngularFireModule,
        AngularFireStorageModule
      ],
      providers: [        
        { provide: Storage, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: Auth, useValue: mockAuth },
        { provide: Firestore, useValue: {} },
        { provide: ToastrService, useValue: toastrServiceStub },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordComponent);
    component = fixture.componentInstance;
    // router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('load user', () => {
    let user = component.currentUser;
    localStorage.getItem('currentUser');
    component.loadUser();
    expect(component).toBeTruthy();
  });

  it('should check confirm password', () => {
    component.password;
    component.confirmed;
    spyOn(component, 'checkConfirmPassword').and.callThrough();
    component.checkConfirmPassword();
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.authForm).toBeDefined();
    expect(component.authForm.controls['password'].value).toBeNull();
    expect(component.authForm.controls['newPassword'].value).toBeNull();
    expect(component.authForm.controls['confirmPassword'].value).toBeNull();
  });

  it('should load user from local storage', () => {
    const mockUser = { email: 'test@example.com' };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));

    component.loadUser();

    expect(component.currentUser).toEqual(mockUser);
  });

  it('should validate password matching', () => {
    component.authForm.controls['password'].setValue('oldPassword');
    component.authForm.controls['newPassword'].setValue('newPassword123');
    component.authForm.controls['confirmPassword'].setValue('newPassword123');

    component.checkConfirmPassword();

    expect(component.checkPassword).toBeTrue();
    expect(component.authForm.controls['confirmPassword'].valid).toBeTrue();
  });


  
  

  it('should show error message for unmatched passwords', () => {
    component.authForm.controls['password'].setValue('oldPassword');
    component.authForm.controls['newPassword'].setValue('newPassword123');
    component.authForm.controls['confirmPassword'].setValue('differentPassword');

    component.checkConfirmPassword();

    expect(component.authForm.controls['confirmPassword'].hasError('matchError')).toBeTrue();
    expect(component.checkPassword).toBeFalse();
  });

  
  

});