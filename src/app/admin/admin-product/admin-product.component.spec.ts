/* tslint:disable:no-unused-variable */
import {  ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AdminProductComponent } from './admin-product.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { ProductService } from '../../shared/services/product/product.service';
import { CategoryService } from '../../shared/services/category/category.service';
import { IProductRequest, IProductResponse } from '../../shared/interfaces/product/product.interface';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';
import { AdditionProductService } from '../../shared/services/addition-product/addition-product.service';
import { TypeProductService } from '../../shared/services/type-product/type-product.service';
import { ICategoryResponse } from '../../shared/interfaces/category/category.interface';


describe('AdminProductComponent', () => {
  let component: AdminProductComponent;
  let fixture: ComponentFixture<AdminProductComponent>;
  let productService: ProductService;
  let categoryService: jasmine.SpyObj<CategoryService>;

  const mockProduct: IProductResponse = {
    id: '1',
    category: { id: 1, name: '', path: '', imagePath: '' },
    type_product: { id: 1, name: '', path: '', imgPath: '' },
    type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    selected_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
    name: 'test name', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1   
  };

  const productServiceStub = {
    getOneFirebase: (id: string) => of({
      id: id,
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{}],
      name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }),
    getAllByCategoryFirebase: () => of([{
      id: '1',
      category: { id: 1, name: '', path: '', imagePath: '' },
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
    createFirebase: (product: IProductRequest) => {
        return Promise.resolve({ id: '1' } as DocumentReference<DocumentData>);
      },
    updateFirebase: (product: IProductRequest, id: string) => {
        return Promise.resolve({ id: id } as DocumentReference<DocumentData>);
    }, 
    deleteFirebase: (id: string) => of([{
        id: id,     
        category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
    }]),
  };
  
  const serviceAdditionProductStub = {
    getOneFirebase: (id: string) => of({      
      id: id, 
      name: 'test type',
      description: '',
      weight: '25',
      price: 5,
      imagePath: '',
      isSauce: false
    }),
    getAllFirebase: () => of([
      { id: 1, 
        name: 'test type', 
        description: '',
        weight: '25',
        price: 5,
        imagePath: '',
        isSauce: false}
    ])
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
        }])
  };

  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AdminProductComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        AngularFireModule,
        MatDialogModule
      ],
      providers: [
        { provide: Storage, useValue: {} },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: ProductService, useValue: productServiceStub },
        { provide: CategoryService, useValue: categoryServiceStub },
        { provide: AdditionProductService, useValue: serviceAdditionProductStub },
        { provide: TypeProductService, useValue: serviceTypeProductStub }        
      ]
    })
    .compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('name')).toBeDefined();
  });
  
  it(`should return empty list of products'`, () => {
    const fixture = TestBed.createComponent(AdminProductComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(ProductService);
    spyOn(service,"getAllFirebase").and.callFake(() => {
      return of([]);
    });
    app.loadProduct();
    expect(app.adminProducts).toEqual([]);
  });

  it(`should return list of products'`, () => {
    const fixture = TestBed.createComponent(AdminProductComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(ProductService);
    spyOn(service,"getAllFirebase").and.callFake (() => {
      return of([
        { 
          id: '1',     
          category: { id: 1, name: '', path: '', imagePath: '' },
          type_product: { id: 1, name: '', path: '', imgPath: '' },
          type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
          selected_addition: [{}],
          name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1   
        }
      ])
    });
    app.loadProduct();
    expect(app.adminProducts.length).toEqual(1);
  });


  it('should load products on initialization', () => {
    let service = fixture.debugElement.injector.get(ProductService);
    spyOn(service,"getAllFirebase").and.callFake (() => {
      return of([
        { 
          id: '1',     
          category: { id: 1, name: '', path: '', imagePath: '' },
          type_product: { id: 1, name: '', path: '', imgPath: '' },
          type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
          selected_addition: [{}],
          name: '', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1   
        }
      ])
    });
    component.loadProduct();
    fixture.detectChanges();
    
    expect(component.adminProducts.length).toBe(1);
    expect(productService.getAllFirebase).toHaveBeenCalled();
  });
  

  it('should add a new product', fakeAsync(async () => {
    const productRequest: IProductRequest = {       
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'test name', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1   
    };
    component.editStatus = false;  
    component.addProduct();
    tick();
    spyOn(productService, 'createFirebase');    
    if (!component.editStatus) {
      await productService.createFirebase(productRequest);    
      expect(toastrServiceStub.success).toHaveBeenCalled();
      component.productForm.reset();
      expect(component.productForm.get('name')?.value).toBeNull();
    }    
    expect(component).toBeTruthy();
  }));

  it('should edit a  product', fakeAsync(async () => {
    const productRequest: IProductRequest = {       
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'test name', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1   
    };
    component.editStatus = true;
    component.currentProductId = '1';
    component.addProduct();
    tick();
    spyOn(productService, 'updateFirebase');
    if (component.editStatus) {
      await productService.updateFirebase(productRequest, '1');  
      expect(productService.updateFirebase).toHaveBeenCalled();  
      expect(toastrServiceStub.success).toHaveBeenCalled();
      component.productForm.reset();
      expect(component.productForm.get('name')?.value).toBeNull();   
    }
    expect(component).toBeTruthy();
  }));
 
  

  it('should initialize product form on ngOnInit', () => {
    const fixture = TestBed.createComponent(AdminProductComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('name')).toBeDefined(); 
  });


  it('should load categories on loadCategories', fakeAsync (() => {
    const mockCategories: ICategoryResponse[] = [{
      id: 1,
      name: 'test category',
      path: '',
      imagePath: '',
    }];
    let service = fixture.debugElement.injector.get(CategoryService);
    spyOn(service, "getAllFirebase").and.callFake(() => {
          return of([
            mockCategories
          ])
        });   
    component.loadCategories();
    fixture.detectChanges(); 
    tick();
    expect(component.adminCategories.length).toEqual(1);
  }));

  it('should set initial form values', () => {
    const fixture = TestBed.createComponent(AdminProductComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
  
    expect(component.productForm.get('category')?.value).toBeTruthy(); 
  });
  
  it('should update form values on editProduct', () => {
    const fixture = TestBed.createComponent(AdminProductComponent);
    const component = fixture.componentInstance;
    const mockProduct: IProductResponse = {
      id: 1,
      category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'test name', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1   
    };
    fixture.detectChanges();  
    component.editProduct(mockProduct);
    expect(component.productForm.get('name')?.value).toEqual(mockProduct.name);
  });

  
it('delete values product', () => {
  spyOn(component, 'deleteProduct').and.callThrough();
  component.deleteProduct({
    id: 1,
    category: { id: 1, name: '', path: '', imagePath: '' },
      type_product: { id: 1, name: '', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      selected_addition: [{ id: 1, name: '', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }],
      name: 'test name', path: '', ingredients: ' ', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1   
  });
  spyOn(productService, 'deleteFirebase');
  expect(component).toBeTruthy();
});
});