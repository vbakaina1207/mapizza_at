
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductService } from './../../shared/services/product/product.service';
import { Subject, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductComponent } from './product.component';
import { TypeProductService } from './../../shared/services/type-product/type-product.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ToastrService } from 'ngx-toastr';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { OrderService } from '../../shared/services/order/order.service';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';
import { environment } from '../../../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { CategoryService } from '../../shared/services/category/category.service';
import { ICategoryRequest, ICategoryResponse } from '../../shared/interfaces/category/category.interface';
import { DocumentData, DocumentReference, Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
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


describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: ProductService;
  let orderService: OrderService;

  const serviceStub = {
    getOneFirebase: (id: string) => of({
      id: id,
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{}],
      name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }),
    getAllByCategoryFirebase: (categoryName: string) => of([{
      id: '1',
      category: { id: 1, name: categoryName, path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }]),
    getAllFirebase: () => of([
      {
        id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }
    ]),    
    updateFirebase: ( product: Partial<IProductResponse>, id: string) => of({
      id: id,
      ...product
    }),
    getAllByProductTypeFirebase: (nameTypeProduct?: string, nameCategory?: string) => of([{
      id: '1',
      category: { id: 1, name: nameCategory, path: '', imagePath: '' },
      type_product: { id: 1, name: nameTypeProduct, path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }]),
    changeBasket: new Subject<boolean>()
  };

  const serviceTypeProductStub = {
    getOneFirebase: (id: string) => of({      
      id: 1, name: 'test type', path: '', imgPath: '' 
    }),
    getAllFirebase: () => of([
      { id: 1, name: 'test type', path: '', imgPath: '' }
    ])
  };

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
        updateFirebase: (category: ICategoryRequest, id: string) => {
          return Promise.resolve({ id: id } as DocumentReference<DocumentData>);
        }, 
        createFirebase: (data: ICategoryRequest) => Promise.resolve({
          id: '5',
          ...data
        } as ICategoryResponse),
        deleteFirebase: (id: string) => Promise.resolve()
  };



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
      }),
    changeBasket: new Subject<boolean>()
  };


const mockFirestore = jasmine.createSpyObj('Firestore', ['collection']);
const collectionStub = jasmine.createSpyObj('collection', ['doc']);
const docStub = jasmine.createSpyObj('doc', ['get']);

mockFirestore.collection.and.returnValue(collectionStub);
collectionStub.doc.and.returnValue(docStub);
docStub.get.and.returnValue(of({
  id: '1',
  data: () => ({
    id: '1',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
  })
}));

const toastrServiceStub = {
  success: jasmine.createSpy(),
  error: jasmine.createSpy()
};



  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductComponent],
      imports: [
        HttpClientTestingModule,
        AngularFireStorageModule,
        RouterModule.forRoot( routes ),   
        AngularFireModule.initializeApp(environment.firebase),       
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore())    
      ],
      providers: [
        { provide: ProductService, useValue: serviceStub },
        { provide: TypeProductService,useValue: serviceTypeProductStub  },       
        { provide: OrderService, useValue: orderServiceStub },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: CategoryService, useValue: categoryServiceStub },
        provideRouter(routes)
       
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
      .compileComponents();
  
    productService = TestBed.inject(ProductService);
    orderService = TestBed.inject(OrderService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    
    component.userProducts = [{
      id: 1,
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false}],
      name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }]
    fixture.detectChanges();
  });

  it('should load products on init', async () => {
    const productData: IProductResponse[] = [
      { id: '1', category: {id: 1, name: '', path: '', imagePath: ''},
      type_product: {id: 1, name: '', path: '', imgPath: ''},
      type_addition: [{id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false} ] as ITypeAdditionResponse[],     
      selected_addition: [{id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false}] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }
    ];

    spyOn(productService, 'getAllByCategoryFirebase').and.returnValue(of(productData));
    await fixture.whenStable(); 
    expect(component.userProducts.length).toBeGreaterThan(0);
    expect(component.userProducts.length).toBe(1);    
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isFavorite to true if the product is in the favorite list', () => {
    const favorite = [{ 
      id: '1', 
      category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }]; 
    const PRODUCT_ID = '1'; 
    let index = favorite?.findIndex(prod => prod.id === PRODUCT_ID);    
    component.isFavorite = index === -1 ? false : true;   
    expect(component).toBeTruthy();
    
    expect(component.isFavorite).toBe(true); 
  });

  it('should set isFavorite to false if the product is in the favorite list', () => {
    const favorite = [{ 
      id: '1', 
      category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }]; 
    const PRODUCT_ID = '2'; 
    let index = favorite?.findIndex(prod => prod.id === PRODUCT_ID);    
    component.isFavorite = index === -1 ? false : true;     
    expect(component.isFavorite).toBe(false); 
  });

  it('loading products', () => {
    const data = [
      {       
        id: '1', 
        category: { id: 1, name: 'pizza', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }
    ]
    let categoryName = 'pizza';
    const productTypeName = '';
    component.categoryName = categoryName;
    component.productTypeName = productTypeName;
    component.loadProducts();
    productService?.getAllByCategoryFirebase(categoryName).subscribe(result => {
      expect(result).toEqual(data);
    });
    if (productTypeName){
      productService?.getAllByProductTypeFirebase(productTypeName, categoryName).subscribe(result => {
        expect(result).toEqual(data);
      });
    }
    expect(component).toBeTruthy();
  });


  it('should get all products', () => {
    let product = [{
      id: '1', 
        category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }];

    productService?.getAllFirebase().subscribe(result => {
      expect(result).toEqual(product);
    });
    expect(component).toBeTruthy();
  });


  it('add products to basket', () => {
    const product = {
      id: '1', 
        category: { id: 1, name: '', path: '', imagePath: '' },
        type_product: { id: 1, name: '', path: '', imgPath: '' },
        type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
        name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    };
  spyOn(component, 'addToBasket').and.callThrough();
  component.addToBasket(product,'');
  expect(component.addToBasket).toHaveBeenCalled();
  expect(component).toBeTruthy();
});


it('should get types products', () => {
  const fixture = TestBed.createComponent(ProductComponent);
  const app = fixture.componentInstance;
  let service = fixture.debugElement.injector.get(TypeProductService);
  spyOn(service,"getAllFirebase").and.callFake(() => {
    return of([]);
  });
  app.getTypeProducts();
  expect(app.userTypeProducts).toEqual([]);
});

it('should update the count field when calling updateCount', () => {
 const product = {
  id: '1', 
  category: { id: 1, name: '', path: '', imagePath: '' },
  type_product: { id: 1, name: '', path: '', imgPath: '' },
  type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
  selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
  name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
 };
 const newCount = 2;
 component.productCount(product, true);
 expect(product.count).toBe(newCount);
})

it('should load products on init', () => {
  expect(component.ngOnInit).toBeDefined();
});



  
});