/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminAdditionTypeComponent } from './admin-addition-type.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@angular/fire/storage';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { ImageService } from '../../shared/services/image/image.service';
import { AdditionProductService } from '../../shared/services/addition-product/addition-product.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';

describe('AdminAdditionTypeComponent', () => {
  let component: AdminAdditionTypeComponent;
  let fixture: ComponentFixture<AdminAdditionTypeComponent>;
  let imageService: ImageService;
  let toastService: ToastService;
  let dialog: MatDialog;
  let additionProductService: AdditionProductService;

  const serviceAdditionProductStub = {     
    getAllFirebase: jasmine.createSpy('getAllFirebase').and.returnValue(of([
      { id: '1', name: 'test type', description: '', weight: '25', price: 5, imagePath: '', isSauce: false }
    ])),    
    createFirebase: (news: ITypeAdditionResponse) => {
      return Promise.resolve({ id: '5' } as DocumentReference<DocumentData>);
    },
    updateFirebase: (news: ITypeAdditionResponse, id: string) => {
      return Promise.resolve({ id: id } as DocumentReference<DocumentData>);
    },   
    deleteFirebase: jasmine.createSpy('deleteFirebase').and.returnValue(Promise.resolve({}))
  };
  
  const mockImageService = {
    uploadFile: jasmine.createSpy('uploadFile').and.returnValue(Promise.resolve('uploadedImagePath')),
    deleteUploadFile: jasmine.createSpy('deleteUploadFile').and.returnValue(Promise.resolve(true))
  };

  const mockToastService = {
    showSuccess: jasmine.createSpy('showSuccess'),
    showError: jasmine.createSpy('showError')
  };
  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  const mockDialog = {
    open: jasmine.createSpy('open').and.returnValue({
      afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of(true))
    })
  };
    

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AdminAdditionTypeComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: Storage, useValue: {} },
        { provide: ToastService, useValue: mockToastService },
        { provide: AdditionProductService, useValue: serviceAdditionProductStub },
        { provide: ImageService, useValue: mockImageService },       
        { provide: MatDialog, useValue: mockDialog }
      ]
    })
    .compileComponents();

    additionProductService = TestBed.inject(AdditionProductService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAdditionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.typeAdditionForm).toBeDefined();
    expect(component.typeAdditionForm.get('name')?.value).toBeNull();
    expect(component.typeAdditionForm.get('isSauce')?.value).toBe(false);
  });

  it('should load type addition products on init', () => {
    component.loadTypeAddition();
    expect(component.adminAdditionProducts.length).toBe(1);
    expect(serviceAdditionProductStub.getAllFirebase).toHaveBeenCalled();
  });

  it('should open the form for adding a new product', () => {
    component.openForm();
    expect(component.isAdd).toBe(true);
  });



  it('should add a new product', async () => {
    const additionProduct = {
          name: 'New Type',
          description: 'New Description',
          weight: '10',
          price: 10,
          path: 'new-path',
          imagePath: 'new-image-path',
          isSauce: false
        };    

    component.isAdd = true;
    component.editStatus = false;
    component.typeAdditionForm.setValue(additionProduct);    
    expect(component.typeAdditionForm.valid).toBeTrue();
    component.addAdditionProduct();   
    // expect(component.toastr.showSuccess).toHaveBeenCalled(); 

    expect(component.isAdd).toBe(false);
    component.typeAdditionForm.reset();
    expect(component.editStatus).toBeFalse();
    expect(component.typeAdditionForm.valid).toBeFalse();
  });


  it('should edit an existing product', async () => {
    component.editStatus = true;
    component.currentTypeAdditionId = '1';
    component.typeAdditionForm.setValue({
      name: 'Edited Type',
      description: 'Edited Description',
      weight: '20',
      price: 20,
      path: 'edited-path',
      imagePath: 'edited-image-path',
      isSauce: false
    });
    component.addAdditionProduct();    
    if (component.editStatus) {
      await additionProductService.updateFirebase(component.typeAdditionForm.value, '1').then(() => {  
        expect(mockToastService.showSuccess).toHaveBeenCalledWith('', 'Type of product successfully updated');
      })
    }
    expect(component.editStatus).toBeFalse();
  });

  it('should handle product deletion', async () => {
    const productToDelete = {
      id: '1',
      name: 'test type',
      description: '',
      weight: '25',
      price: 5,
      path: '',
      imagePath: 'test path',
      isSauce: false
    };
    component.deleteAdditionProduct(productToDelete);    
    await fixture.whenStable();
    expect(serviceAdditionProductStub.deleteFirebase).toHaveBeenCalledWith('1');
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('', 'Type of product successfully deleted');
  });

  it('should upload an image', async () => {
    const file = new File([''], 'test.png');
    const event = { target: { files: [file] } };
    component.typeAdditionForm.setValue ({
      name: 'test type',
      description: '',
      weight: '25',
      price: 5,
      path: '',
      imagePath: 'test path',
      isSauce: false
    })
    component.upload(event);
    expect(mockImageService.uploadFile).toHaveBeenCalledWith('images', 'test.png', file);
    expect(component.typeAdditionForm.get('imagePath')?.value).toBe('test path');   
  });


  it('should delete an image', async () => {
    component.typeAdditionForm.get('imagePath')?.setValue('test-path');
    component.deleteImage();
    expect(mockImageService.deleteUploadFile).toHaveBeenCalledWith('test-path');
    expect(component.typeAdditionForm.get('imagePath')?.value).toBe('test-path');
    expect(component.isUploaded).toBe(false);
    
  });
  
});