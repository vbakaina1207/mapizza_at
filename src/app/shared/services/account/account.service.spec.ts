/* tslint:disable:no-unused-variable */

import { TestBed,  fakeAsync, inject, tick } from '@angular/core/testing';
import { AccountService } from './account.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { Observer, Subject, of, throwError } from 'rxjs';

describe('Service: Account', () => {
  let service: AccountService;
  let httpClient: HttpClientTestingModule;

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

  const mockError = new HttpErrorResponse({ error: 'Unauthorized' });

  const errorObservable = throwError(() => mockError);

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [AccountService],
      imports: [
        HttpClientTestingModule
      ]
    }).compileComponents();

    service = TestBed.inject(AccountService);
    httpClient = TestBed.inject(HttpClientTestingModule);

  });

  it('should ...', inject([AccountService], (service: AccountService) => {
    expect(service).toBeTruthy();
  }));


  

  it('updateAddress should update searchAddress subject', () => {
    const newAddress = '123 Main St';
    spyOn(service.searchAddress, 'next');

    service.updateAddress(newAddress);

    expect(service.searchAddress.next).toHaveBeenCalledWith(newAddress);
  });

  it('setZoneStatus should update zoneStatus subject', fakeAsync(() => {
    const isGreenZone = true;
    const isYellowZone = false;
    
    spyOn(accountServiceStub.zoneStatus$, 'next');

    accountServiceStub.setZoneStatus(isGreenZone, isYellowZone);
    tick();
    expect(accountServiceStub.zoneStatus$.next).toHaveBeenCalledWith({ isGreenZone, isYellowZone });
  }));

  it('login should handle error', fakeAsync(() => {
    const mockCredentials = { email: 'test@example.com', password: 'password123' };
    const mockError = new HttpErrorResponse({ error: 'Unauthorized' });

    spyOn(service['http'], 'get').and.returnValue(throwError(() => mockError));

    const loginObservable = service.login(mockCredentials);

    loginObservable.subscribe({
      next() {
        fail('should not reach here in error case');
      },
      error(err) {
        expect(err.error).toEqual('Unauthorized');
      }
    });
    tick();
  }));

  it('login should return an observable', fakeAsync(() => {
    const mockCredentials = { email: 'test@example.com', password: 'password123' };
    const mockResponse = { token: 'abc123' };

    spyOn(service['http'], 'get').and.returnValue(of(mockResponse));

    const loginObservable = service.login(mockCredentials);

    loginObservable.subscribe({
      next(response) {
        expect(response).toEqual(mockResponse);
      },
      error() {
        fail('should not reach here in success case');
      }
    });
    tick();
  }));


  
});