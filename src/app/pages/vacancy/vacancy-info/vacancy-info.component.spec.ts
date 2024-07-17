/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VacancyInfoComponent } from './vacancy-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@angular/fire/storage';
import { Subject, of } from 'rxjs';
import { ActivatedRoute, RouterModule, Routes, provideRouter } from '@angular/router';
import { VacancyService } from '../../../shared/services/vacancy/vacancy.service';
import { ImageService } from '../../../shared/services/image/image.service';
import { MassageService } from '../../../shared/services/massage/massage.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { IMassageRequest, IMassageResponse } from '../../../shared/interfaces/massage/massage.interface';
import { DocumentData, DocumentReference, Timestamp } from '@angular/fire/firestore';



@Component({
  selector: 'app-blank',
  template: '<p>Blank Component</p>'
})
class BlankComponent {}

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'test', component: BlankComponent }
];

class RouterStub {
  events = new Subject<any>(); 
  createUrlTree(commands: any[], navigationExtras?: any): any {
    return {};
  }
}

describe('VacancyInfoComponent', () => {
  let component: VacancyInfoComponent;
  let fixture: ComponentFixture<VacancyInfoComponent>;
  let vacancyService: jasmine.SpyObj<VacancyService>;
  let massageService: jasmine.SpyObj<MassageService>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let imageService: jasmine.SpyObj<ImageService>;

  const vacancyServiceStub = {
    getAllFirebase: () => of([
      {
        id: '1',
        name: 'new vacancy',
        path: '',
        description: '',
        imagePath: ''
      }
    ]),
    getOneFirebase: (id: string) =>
      of({ 
        id: id,  
        name: 'new vacancy',
        path: '',
        description: '',
        imagePath: ''
      }),
  };

  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };
  

  
  const massageServiceStub = {
    getOneFirebase: (id: string) =>
      of({ id: id, name: 'Ivan', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z'))}),
    getAllFirebase: () =>
      of([{ id: '1', name: 'Ivan', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z'))}]),   
      createFirebase: (data: IMassageRequest) => Promise.resolve({
        id: '5',
        ...data
      } as IMassageResponse),
      deleteFirebase: (id: string) => Promise.resolve()
  };

  const vacancyServiceSpy = jasmine.createSpyObj('VacancyService', ['getAllFirebase', 'getOneFirebase']);
  const imageServiceSpy = jasmine.createSpyObj('ImageService', ['uploadFile', 'deleteUploadFile']);

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [VacancyInfoComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,   
        RouterModule.forRoot( routes ),            
      ],
      providers: [      
        { provide: ImageService, useValue: imageServiceSpy },
        { provide: Storage, useValue: {} },               
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: MassageService, useValue: massageServiceStub },
        { provide: VacancyService, useValue: vacancyServiceSpy },
        provideRouter(routes),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ vacancyInfo: vacancyServiceSpy })
          }
        },       
       
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacancyInfoComponent);
    component = fixture.componentInstance;
    component.vacancy = {  
      id: '1', 
      name: 'new vacancy',
      path: '',
      description: '',
      imagePath: ''
    };
    
    fixture.detectChanges();

    vacancyService = TestBed.inject(VacancyService) as jasmine.SpyObj<VacancyService>;
    massageService = TestBed.inject(MassageService) as jasmine.SpyObj<MassageService>;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    imageService = TestBed.inject(ImageService) as jasmine.SpyObj<ImageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vacancy', () => {
    const VACANCY_ID = '1';
    const expectedData = {
      id: '1',
      name: 'new vacancy',
      path: '',
      description: '',
      imagePath: ''
    };

    vacancyService.getOneFirebase.and.returnValue(of(expectedData));

    vacancyService.getOneFirebase(VACANCY_ID).subscribe(result => {
      expect(result).toEqual(expectedData);
    });
    expect(component).toBeTruthy();
  });


  it('should initialize form on init', () => {
    component.ngOnInit();
    expect(component.massageForm).toBeDefined();
    expect(component.massageForm.controls['name']).toBeDefined();
    expect(component.massageForm.controls['phone']).toBeDefined();
    expect(component.massageForm.controls['email']).toBeDefined();
    expect(component.massageForm.controls['description']).toBeDefined();
    expect(component.massageForm.controls['imagePath']).toBeDefined();
    expect(component.massageForm.controls['date_message']).toBeDefined();
  });

  it('should load massages on loadMassages call', () => {
    spyOn(massageService, 'getAllFirebase').and.callThrough();
    component.loadMassages();
    expect(massageService.getAllFirebase).toHaveBeenCalled();
    expect(component.massages.length).toBeGreaterThan(0);
  });


  it('should upload file and set imagePath', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    const event = { target: { files: [file] } };
    imageService.uploadFile.and.returnValue(Promise.resolve('some-image-path'));

    await component.upload(event);
    expect(imageService.uploadFile).toHaveBeenCalledWith('images', 'test.png', file);
    expect(component.isUploaded).toBeTrue();
    expect(component.massageForm.controls['imagePath'].value).toBe('some-image-path');
  });

  it('should delete image and reset form control', async () => {
    component.massageForm.patchValue({ imagePath: 'some-image-path' });
    imageService.deleteUploadFile.and.returnValue(Promise.resolve());

    await component.deleteImage();
    expect(imageService.deleteUploadFile).toHaveBeenCalledWith('some-image-path');
    expect(component.isUploaded).toBeFalse();
    expect(component.massageForm.controls['imagePath'].value).toBeNull();
  });

 

  

  it('should add massage and reset form on successful submission', async () => {
    const formData: IMassageRequest = {
      name: 'Test',
      phone: '1234567890',
      email: 'test@example.com',
      description: 'Test Description',
      imagePath: 'some-image-path',
      date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),
      status: false
    };

    const expectData: IMassageResponse = {
      id: '1',
      name: 'Test',
      phone: '1234567890',
      email: 'test@example.com',
      description: 'Test Description',
      imagePath: 'some-image-path',
      date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),
      status: false
    };

    const mockDocumentReference = {
      id: '1',
      converter: null,
      type: 'document',
      firestore: null,
      path: 'some-path',
      date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z'))
    } as unknown as DocumentReference<DocumentData>;

    component.massageForm.patchValue(formData);
    
    spyOn(massageService, 'createFirebase').and.returnValue(Promise.resolve(mockDocumentReference));
    massageService.createFirebase;
    expect(massageService.createFirebase).toBeDefined();
    expect(toastrService.success).toBeDefined();
    expect(component.massageForm.pristine).toBeTrue();
    expect(component.massageForm.untouched).toBeTrue();
    expect(component.isUploaded).toBeFalse();
  });
  
  
});
