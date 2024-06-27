/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';


import { AuthDialogComponent } from './auth-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

describe('AuthDialogComponent', () => {
  let component: AuthDialogComponent;
  let fixture: ComponentFixture<AuthDialogComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AuthDialogComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: Auth, useValue: {} },
        { provide: Firestore, useValue: {} },
        { provide: ToastrService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('test login  #testIt()', fakeAsync (() => {
    const spy = spyOn(component,'login').and.callThrough();
    spy.and.returnValue(Promise.resolve({
      credential: null,
      user: null,
    }));
    component.login('admin@gmail.com','qwerty123');
    tick();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(component).toBeTruthy();
  }));

  it('should check confirm password', () => {
    spyOn(component, 'checkVisibilityError').and.callThrough();
    component.checkVisibilityError('123123', '123123');
    expect(component).toBeTruthy();
  });


  it('should check confirm password', () => {
    component.password;
    component.confirmed;
    spyOn(component, 'checkConfirmPassword').and.callThrough();
    component.checkConfirmPassword();
    expect(component).toBeTruthy();
  });
});