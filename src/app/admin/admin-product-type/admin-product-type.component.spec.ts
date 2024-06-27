/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminProductTypeComponent } from './admin-product-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { TypeProductService } from '../../shared/services/type-product/type-product.service';
import { ITypeProductRequest, ITypeProductResponse } from '../../shared/interfaces/type-product/type-product.interface';

describe('AdminProductTypeComponent', () => {
  let component: AdminProductTypeComponent;
  let fixture: ComponentFixture<AdminProductTypeComponent>;
  let typeProductService: TypeProductService;

  const serviceTypeProductStub = {
    getOneFirebase: (id: string) => of({      
      id: id, name: 'test type', path: '', imgPath: '' 
    }),
    getAllFirebase: () => of([
      { id: 1, name: 'test type', path: '', imgPath: '' }
    ]), 
    createFirebase: (typeProduct: ITypeProductRequest) =>  {
      return Promise.resolve({ id: '1' } as DocumentReference<DocumentData>);
    },
    updateFirebase: (typeProduct: ITypeProductRequest, id: string) => {
      return Promise.resolve({ id: id } as DocumentReference<DocumentData>);
  }, 
  deleteFirebase: (id: string) => of([{
    id: id, name: '', path: '', imgPath: ''
  }]),
  };

  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AdminProductTypeComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: Storage, useValue: {} },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: TypeProductService, useValue: serviceTypeProductStub}
      ]
    })
    .compileComponents();

    typeProductService = TestBed.inject(TypeProductService) as jasmine.SpyObj<TypeProductService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.typeProductForm).toBeDefined();
    expect(component.typeProductForm.get('name')).toBeDefined();
  });

  it(`should return empty list of type of products'`, () => {
    const fixture = TestBed.createComponent(AdminProductTypeComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(TypeProductService);
    spyOn(service,"getAllFirebase").and.callFake(() => {
      return of([]);
    });
    app.loadTypeProducts();
    expect(app.adminTypeProducts).toEqual([]);
  });

  it(`should return list of type products'`, () => {
    const fixture = TestBed.createComponent(AdminProductTypeComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(TypeProductService);
    spyOn(service,"getAllFirebase").and.callFake (() => {
      return of([
        {
           id: 1, name: '', path: '', imgPath: '' 
        }
      ])
    });
    app.loadTypeProducts();
    expect(app.adminTypeProducts.length).toEqual(1);
  });

  it('should load type products on initialization', () => {
    let service = fixture.debugElement.injector.get(TypeProductService);
    spyOn(service,"getAllFirebase").and.callFake (() => {
      return of([
        {  
          id: 1, name: '', path: '', imgPath: ''  
        }
      ])
    });
    component.loadTypeProducts();
    fixture.detectChanges();
    
    expect(component.adminTypeProducts.length).toBe(1);
    expect(typeProductService.getAllFirebase).toHaveBeenCalled();
  });

  it('should add a new type product', fakeAsync(async () => {
    const productRequest: ITypeProductRequest = {            
      name: '', path: '', imgPath: '' 
    };
    component.editStatus = false;  
    component.addTypeProduct();
    tick();
    spyOn(typeProductService, 'createFirebase');    
    if (!component.editStatus) {
      await typeProductService.createFirebase(productRequest);    
      expect(toastrServiceStub.success).toHaveBeenCalled();
      component.typeProductForm.reset();
      expect(component.typeProductForm.get('name')?.value).toBeNull();
    }    
    expect(component).toBeTruthy();
  }));

  it('should edit a  product', fakeAsync(async () => {
    const productRequest: ITypeProductRequest = {             
      name: '', path: '', imgPath: '' 
    };
    component.editStatus = true;
    component.currentTypeProductId = '1';
    component.addTypeProduct();
    tick();
    spyOn(typeProductService, 'updateFirebase');
    if (component.editStatus) {
      await typeProductService.updateFirebase(productRequest, '1');  
      expect(typeProductService.updateFirebase).toHaveBeenCalled();  
      expect(toastrServiceStub.success).toHaveBeenCalled();
      component.typeProductForm.reset();
      expect(component.typeProductForm.get('name')?.value).toBeNull();   
    }
    expect(component).toBeTruthy();
  }));
  
  it('should initialize type product form on ngOnInit', () => {
    const fixture = TestBed.createComponent(AdminProductTypeComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component.typeProductForm).toBeDefined();
    expect(component.typeProductForm.get('name')).toBeDefined(); 
  });

  it('should update form values on editProduct', () => {
    const fixture = TestBed.createComponent(AdminProductTypeComponent);
    const component = fixture.componentInstance;
    const mockProduct: ITypeProductResponse = {
      id: 1,
      name: '', path: '', imgPath: '' 
    };
    fixture.detectChanges();  
    component.editTypeProduct(mockProduct);
    expect(component.typeProductForm.get('name')?.value).toEqual(mockProduct.name);
  });

  it('delete values type product', () => {
    spyOn(component, 'deleteTypeProduct').and.callThrough();
    component.deleteTypeProduct({
      id: 1,
      name: '', path: '', imgPath: '' 
    });
    spyOn(typeProductService, 'deleteFirebase');
    expect(component).toBeTruthy();
  });

});