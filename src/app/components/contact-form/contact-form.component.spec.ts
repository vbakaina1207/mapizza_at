/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ContactFormComponent } from './contact-form.component';
import { Storage } from '@angular/fire/storage';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Auth } from '@angular/fire/auth';;
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { IMassageResponse } from '../../shared/interfaces/massage/massage.interface';
import { ImageService } from '../../shared/services/image/image.service';
import { MassageService } from '../../shared/services/massage/massage.service';



describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  

  const serviceMassageStub = {
    getOneFirebase: (id: string) =>
      of({ id: id, name: 'Ivan', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_message: ''}),
    getAllFirebase: () =>
      of([{ id: 1, name: 'Ivan', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_message: ''}]),
    createFirebase: 
     (massage: IMassageResponse) =>      of({ ...massage }),
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ContactFormComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatDialogModule,       
      ],
      providers: [
        ImageService,
        MassageService,
        { provide: Storage, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        { provide: Auth, useValue: {} },       
        { provide: ToastrService, useValue: {} },
        { provide: MassageService, useValue: serviceMassageStub }
      ],  schemas: [
         
          CUSTOM_ELEMENTS_SCHEMA
          ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly', () => {
    expect(component.massageForm).toBeDefined();
    expect(component.isValid).toBeFalse();
  });

  it('should load massages on init', () => {
    const massageService = TestBed.inject(MassageService);
    spyOn(massageService, 'getAllFirebase').and.callThrough();
    component.ngOnInit();
    expect(massageService.getAllFirebase).toHaveBeenCalled();
  });

  it('should upload file and update form', () => {
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const imageData = 'http://example.com/test.jpg'; 
    spyOn(component.imageService, 'uploadFile').and.returnValue(Promise.resolve(imageData));
  
    const input = fixture.nativeElement.querySelector('input[type="file"]');
    const fileList = { 0: testFile, length: 1, item: (index: number) => testFile };
    Object.defineProperty(input, 'files', {
      value: fileList,
      writable: false
    });
    input.dispatchEvent(new Event('change'));
  
    fixture.detectChanges(); 
  
    expect(component.file).toBe(testFile);
  });
  
  it('should delete uploaded image', async () => {
    component.massageForm.patchValue({ imagePath: 'http://example.com/test.jpg' }); 
    spyOn(component.imageService, 'deleteUploadFile').and.returnValue(Promise.resolve());
  
    component.deleteImage();
  
    await fixture.whenStable(); 
    expect(component.isUploaded).toBeFalse();
    expect(component.massageForm.get('imagePath')?.value).toBeNull();
  });
      

});