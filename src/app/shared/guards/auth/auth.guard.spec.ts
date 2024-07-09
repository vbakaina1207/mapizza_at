import { TestBed } from '@angular/core/testing';

import {  AuthGuardService } from './auth.guard';
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot, Routes, provideRouter } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Auth } from '@angular/fire/auth';
import { Component } from '@angular/core';


@Component({
  selector: 'app-blank',
  template: '<p>Blank Component</p>'
})
class BlankComponent {}

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'test', component: BlankComponent }
];

describe('AuthGuard', () => {
  let guard:  AuthGuardService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: Auth, useValue: {} },
        { provide: Router, useValue: {} },
        provideRouter(routes)
      ],
      imports: [RouterModule.forRoot( routes ) ],
    }).compileComponents();
    
  });

  beforeEach(() => {
    guard = TestBed.inject(AuthGuardService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should canActivate', () => {
    const route = {} as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;
    
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify({ role: 'ADMIN' }));
    spyOn(Router.prototype, 'navigate');

    const result = guard.canActivate(route, state);
    
    expect(result).toBe(true);
    expect(Router.prototype.navigate).not.toHaveBeenCalled();
  });
});