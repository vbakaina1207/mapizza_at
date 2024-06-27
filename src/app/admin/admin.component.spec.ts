/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';

import { AdminComponent } from './admin.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AdminComponent],
      imports:[
        HttpClientTestingModule,
        MatDialogModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [
        NO_ERRORS_SCHEMA
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home page and clear local storage on logout', () => {
    const routerSpy = spyOn(component.router, 'navigate').and.stub();
    spyOn(localStorage, 'removeItem').and.stub();
    const isUserLoginSpy = spyOn(component.accountService.isUserLogin$, 'next').and.callThrough();

    component.logout();

    expect(routerSpy).toHaveBeenCalledWith(['/']);
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    expect(isUserLoginSpy).toHaveBeenCalledWith(true);
  });

});