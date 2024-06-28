/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AdminVacancyComponent } from './admin-vacancy.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentData, DocumentReference } from '@angular/fire/firestore';
import { VacancyService } from '../../shared/services/vacancy/vacancy.service';
import { IVacancyRequest, IVacancyResponse } from '../../shared/interfaces/vacancy/vacancy.interface';

describe('AdminVacancyComponent', () => {
  let component: AdminVacancyComponent;
  let fixture: ComponentFixture<AdminVacancyComponent>;
  let vacancyService : VacancyService;
  let toastService: ToastrService;

  const vacancyServiceStub = {
    getAllFirebase: () => of([
      {
        id: 1,
        name: 'new vacancy',
        path: '',
        description: '',
        imagePath: ''
      }
    ]),
      getOneFirebase: (id: string) => of({      
        id: id, 
        name: 'new vacancy',
        path: '',
        description: '',
        imagePath: ''
      }),
      createFirebase: (data: IVacancyRequest) => Promise.resolve({
        id: '2',
        ...data
      } as IVacancyResponse),
      updateFirebase: (vacancye: IVacancyRequest, id: string) => {
        return Promise.resolve({ id: id } as DocumentReference<DocumentData>);
      }, 
      deleteFirebase: (id: string) => of([{
        id: id,     
        name: 'new vacancy',
        path: '',
        description: '',
        imagePath: ''
      }]),
    
  };

  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AdminVacancyComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        { provide: Storage, useValue: {} },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: VacancyService, useValue: vacancyServiceStub }
      ]
    })
    .compileComponents();

    vacancyService = TestBed.inject(VacancyService) as jasmine.SpyObj<VacancyService>;
    toastService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.vacancyForm).toBeDefined();
    expect(component.vacancyForm.get('name')).toBeDefined();
  });
  
  it(`should return empty list of vacancies'`, () => {
    const fixture = TestBed.createComponent(AdminVacancyComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(VacancyService);
    spyOn(service,"getAllFirebase").and.callFake(() => {
      return of([]);
    });
    app.loadVacancy();
    expect(app.adminVacancy).toEqual([]);
  });

  it(`should return list of vacancies'`, () => {
    const fixture = TestBed.createComponent(AdminVacancyComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(VacancyService);
    spyOn(service,"getAllFirebase").and.callFake (() => {
      return of([
        { 
          id: '1',     
          name: 'new vacancy',
          path: '',
          description: '',
          imagePath: ''
        }
      ])
    });
    app.loadVacancy();
    expect(app.adminVacancy.length).toEqual(1);
  });

  it(`should return empty list of type of products'`, () => {
    const fixture = TestBed.createComponent(AdminVacancyComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(VacancyService);
    spyOn(service,"getAllFirebase").and.callFake(() => {
      return of([]);
    });
    app.loadVacancy();
    expect(app.adminVacancy).toEqual([]);
  });



  it('should load vacancies on initialization', () => {
    let service = fixture.debugElement.injector.get(VacancyService);
    spyOn(service,"getAllFirebase").and.callFake (() => {
      return of([
        { 
          id: '1',     
          name: 'new vacancy',
          path: '',
          description: '',
          imagePath: ''
        }
      ])
    });
    component.loadVacancy();
    fixture.detectChanges();
    
    expect(component.adminVacancy.length).toBe(1);
    expect(vacancyService.getAllFirebase).toHaveBeenCalled();
  });

  it('should add a new vacancy', fakeAsync(async () => {
    const pageRequest: IVacancyRequest = {       
      name: 'new vacancy',
      path: '',
      description: '',
      imagePath: ''
    };
  component.editStatus = false;  
  component.addVacancy();
  tick();
  spyOn(vacancyService, 'createFirebase');    
  if (!component.editStatus) {
    await vacancyService.createFirebase(pageRequest);    
      expect(vacancyService.createFirebase).toHaveBeenCalledWith({  
        name: 'new vacancy',
        path: '',
        description: '',
        imagePath: '' 
      });  
      expect(toastService.success).toHaveBeenCalled();
      component.vacancyForm.reset();
      expect(component.vacancyForm.get('name')?.value).toBeNull();
  }    
  expect(component).toBeTruthy();
  }));

  it('should edit a  vacancy', fakeAsync(async () => {
    const pageRequest: IVacancyRequest = {       
      name: 'new vacancy',
      path: '',
      description: '',
      imagePath: '' 
    };
  component.editStatus = true;
  component.currentVacancyId = '2';
  component.addVacancy();
  tick();
  spyOn(vacancyService, 'updateFirebase');
  if (component.editStatus) {
    await vacancyService.updateFirebase(pageRequest, '2');
  
    expect(vacancyService.updateFirebase).toHaveBeenCalled();  
    expect(toastService.success).toHaveBeenCalled();
    component.vacancyForm.reset();
    expect(component.vacancyForm.get('page')?.value).toBeNull();   
  }
  expect(component).toBeTruthy();
  }));

  it('delete values vacancy', () => {
    spyOn(component, 'deleteVacancy').and.callThrough();
    // component?.deleteVacancy({
    //   id: '2',
    //   name: 'new vacancy',
    //   path: '',
    //   description: '',
    //   imagePath: '' 
    // });
    spyOn(vacancyService, 'deleteFirebase');
    expect(component).toBeTruthy();
  });
});