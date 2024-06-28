import { TestBed } from '@angular/core/testing';

import {  AuthGuardService } from './auth.guard';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Auth } from '@angular/fire/auth';

describe('AuthGuard', () => {
  let guard:  AuthGuardService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthGuardService,
        { provide: Auth, useValue: {} },
        { provide: Router, useValue: {} }
      ],
      imports: [RouterTestingModule],
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