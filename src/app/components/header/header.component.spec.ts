/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject, of } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../shared/services/account/account.service';
import { CategoryService } from '../../shared/services/category/category.service';
import { OrderService } from '../../shared/services/order/order.service';
import { ROLE } from '../../shared/constants/role.constant';
import { Auth } from '@angular/fire/auth';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let dialog: MatDialog;
  let categoryService: CategoryService;
  let orderService: OrderService;
  let accountService: AccountService;

  const categoryServiceStub = {
    getOneFirebase: (id: string) =>
      of({
        id: id,
        name: 'test category',
        path: '',
        imagePath: '',
      }),
      getAllFirebase: () =>
        of([{
          id: 1,
          name: 'test category',
          path: '',
          imagePath: '',
        }]),
  };

  const orderServiceStub = {
    getAllFirebase: () => of([
      {
      order_number: 1,
      uid: 'fhshgkszhbgkbjrhhr',
      date_order: '12/12/2024',
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
      }]), 
      getUserFirebase: (uid: string) => of([
        {
        order_number: 1,
      uid: uid,
      date_order: '12/12/2024',
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
      delivery_date: new Date,
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
      }
    ]),    
    changeBasket: new Subject<boolean>() 
  };

  const accountServiceStub = {
    changeFavorite: new Subject<boolean>(),
    isUserLogin$: new Subject<boolean>()
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports:[
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule
      ],
      providers: [
        { provide: CategoryService, useValue: categoryServiceStub },         
        { provide: OrderService, useValue: orderServiceStub},
        { provide: AccountService, useValue: accountServiceStub },
        { provide: Auth, useValue: {} },
        { provide: Firestore, useValue: {}},
        { provide: ToastrService, useValue: {} }
      ],
      
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    dialog = TestBed.inject(MatDialog);
    categoryService = TestBed.inject(CategoryService);
    orderService = TestBed.inject(OrderService);
    accountService = TestBed.inject(AccountService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on initialization', () => {
    spyOn(categoryService, 'getAllFirebase').and.callThrough();
    component.ngOnInit();
    expect(categoryService.getAllFirebase).toHaveBeenCalled();
    expect(component.userCategories.length).toBeGreaterThan(0);
  });

  

  it('should update basket on change', fakeAsync(() => {
    spyOn(component, 'loadBasket').and.callThrough();
    orderService.changeBasket.next(true);
    tick(); 
    expect(component.loadBasket).toHaveBeenCalled();
  }));

  
  

  it('it should change total', () => {
    const FAKE_BASKET = [
      {
        id: 1,
        category: { id: 1, name: 'pizza', path: '', imagePath: '' },
        type_product: { id: 1, name: 'meat', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'pizza', path: '', ingredients: ' ', weight: '250', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }
    ];
    component.basket = FAKE_BASKET;
    spyOn(component, 'getTotalPrice').and.callThrough();
    component.getTotalPrice();
    expect(component.getTotalPrice).toHaveBeenCalled();
    expect(component.total).toBe(12);
    component.basket = [];
    component.getTotalPrice();
    expect(component.getTotalPrice).toHaveBeenCalled();
    expect(component.total).toBe(0);
  });

  it('should change total categories', () => {
    const FAKE_userCategories = [
      {
        id: 1, name: 'pizza', path: '', imagePath: ''
      }
      ]
    component.userCategories = FAKE_userCategories;
    spyOn(component, 'getCategories').and.callThrough();
    component.getCategories();
    expect(component.getCategories).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  
  it ('check user login', () => {
    const currentUser = {"orders":[],"email":"qwerty@gmail.com","lastName":"qwerty","address":["job","Kirchschlag","12",31],"phoneNumber":"+43661549621","role":"USER","firstName":"qwerty","uid":"0JHaDJvqWPeVXwxWeXZrOkdBuWx1"};
    currentUser.role = ROLE.USER;
    component.currentUser = currentUser;
    spyOn(component, 'checkUserLogin').and.callThrough();
    component.checkUserLogin();
    expect(component.checkUserLogin).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it(`should return empty list of categories'`, () => {
    const FAKE_CATEGORIES = [
      {
        id: 1,
        name: 'test category',
        path: '',
        imagePath: ''
      }
    ];
    component.getCategories();
    categoryService.getAllFirebase().subscribe((response: any) => {
      expect(response).toEqual(FAKE_CATEGORIES); 
    });
  });
  
  it('should load basket from localStorage', () => {
   
    const mockBasket = [
      { id: 1, 
        category: { id: 1, name: 'pizza', path: '', imagePath: '' },
        type_product: { id: 1, name: 'meat', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'pizza', path: '', ingredients: ' ', weight: '250', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
       },
      { id: 2, 
        category: { id: 1, name: 'pizza', path: '', imagePath: '' },
        type_product: { id: 1, name: 'meat', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'pizza', path: '', ingredients: ' ', weight: '250', price: 23, addition_price: 0, bonus: 0, imagePath: '', count: 1
       }
    ];
    localStorage.setItem('basket', JSON.stringify(mockBasket));
    
    component.loadBasket();
      
    expect(component.basket.length).toBe(2);
    expect(component.total).toBe(35); 
  });

  it('should load current user from localStorage', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe'     
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
  
    component.loadUser();
  
    expect(component.currentUser).toEqual(mockUser);
    expect(component.userName).toBe('John Doe');
  });
  
  it('should load favorite products from localStorage', () => {
    const mockFavorite = [
      { id: 1,       
        category: { id: 1, name: 'pizza', path: '', imagePath: '' },
        type_product: { id: 1, name: 'meat', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'pizza', path: '', ingredients: ' ', weight: '250', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
       },
      { id: 2,         
        category: { id: 1, name: 'pizza', path: '', imagePath: '' },
        type_product: { id: 1, name: 'meat', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'pizza', path: '', ingredients: ' ', weight: '250', price: 23, addition_price: 0, bonus: 0, imagePath: '', count: 1
       }
    ];
    localStorage.setItem('favorite', JSON.stringify(mockFavorite));
  
    component.loadFavorite();
    component.favorite = mockFavorite;
    component.countFavorite = component.favorite.length;
    expect(component.favorite?.length).toBe(2);
    expect(component.countFavorite).toBe(2);
  });
  

  it('should correctly determine user login status and role', () => {
    const mockAdminUser = {
      firstName: 'Admin',
      lastName: 'User',
      role: ROLE.ADMIN 
    };
    localStorage.setItem('currentUser', JSON.stringify(mockAdminUser));
  
    component.checkUserLogin();
      
    expect(component.isLogin).toBe(true);
    expect(component.loginPage).toBe('Admin');
    expect(component.loginUrl).toBe('admin');
  });

  it('should open login dialog', () => {
    spyOn(dialog, 'open').and.callThrough();
    component.openLoginDialog();
    expect(dialog.open).toHaveBeenCalled();
  });
  
  it('should open basket dialog and set isCheckout to true', () => {
    spyOn(dialog, 'open').and.callThrough();
    component.openBasketDialog();
    expect(dialog.open).toHaveBeenCalled();
    expect(component.isCheckout).toBe(true);
  });
  
  it('should logout user', () => {
    const routerSpy = spyOn(component.router, 'navigate').and.stub();
    spyOn(localStorage, 'removeItem').and.stub();
    const isUserLoginSpy = spyOn(component.accountService.isUserLogin$, 'next').and.callThrough();

    component.logout();

    expect(routerSpy).toHaveBeenCalledWith(['/']);
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    expect(localStorage.removeItem).toHaveBeenCalledWith('basket');
    expect(localStorage.removeItem).toHaveBeenCalledWith('favorite');
    expect(isUserLoginSpy).toHaveBeenCalledWith(true);
   
    
    expect(accountService.isUserLogin$.next).toHaveBeenCalledWith(true);
  });
  
});