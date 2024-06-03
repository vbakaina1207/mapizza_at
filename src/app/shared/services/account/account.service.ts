import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ILogin } from '../../account/account.interface';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { IProductResponse } from '../../interfaces/product/product.interface';

@Injectable({
  providedIn: 'root'
})
    
export class AccountService {
    
    public isUserLogin$ = new Subject<boolean>();
    public changeAddress = new Subject<boolean>();
    public changeCurrentUser = new Subject<boolean>();  
    public changeFavorite = new Subject<boolean>();
    public searchAddress = new Subject<string>();
    address$ = this.searchAddress.asObservable();
    private zoneStatus = new Subject<{ isGreenZone: boolean; isYellowZone: boolean }>();
    zoneStatus$ = this.zoneStatus.asObservable();    
    public index!: number;
    public isEdit!: boolean;
    public userAddress = [];
    public oldUserAddress = [];
    public datauser = {};
    public PRODUCT_ID: string = '';
    public VACANCY_ID: string = '';
    public favoriteProducts: Array<IProductResponse> = [];
    private url = environment.BACKEND_URL;
    private api = { auth: `${this.url}/auth` };

    constructor(
        private http: HttpClient
    ) {}

    login(credential: ILogin): Observable<any> {
        return this.http.get(`${this.api.auth}?email=${credential.email}&password=${credential.password}`)
    }

    updateAddress(address: string) {
        this.searchAddress.next(address);
    }
    
    setAddress(address: string) {
        this.searchAddress.next(address);
    }

    setZoneStatus(isGreenZone: boolean, isYellowZone: boolean) {
        this.zoneStatus.next({ isGreenZone, isYellowZone });
    }

}
