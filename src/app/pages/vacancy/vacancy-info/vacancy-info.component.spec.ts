/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VacancyInfoComponent } from './vacancy-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@angular/fire/storage';
import { Subject, of } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, Routes, provideRouter } from '@angular/router';
import { VacancyService } from '../../../shared/services/vacancy/vacancy.service';
import { ImageService } from '../../../shared/services/image/image.service';
import { MassageService } from '../../../shared/services/massage/massage.service';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';



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
  let vacancyService: VacancyService;

  const vacancyServiceStub = {
    getAllFirebase: () => of([
      {
        id: 1,
        name: 'new vacancy',
        path: '',
        description: '',
        imagePath: ''
      }
    ])
  };

  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };
  

  
  const massageServiceStub = {
    getOneFirebase: (id: string) =>
      of({ id: id, name: 'Ivan', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_message: ''}),
    getAllFirebase: () =>
      of([{ id: 1, name: 'Ivan', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_message: ''}]),
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [VacancyInfoComponent],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,   
        RouterModule.forRoot( routes ),            
      ],
      providers: [
        ImageService  ,
        { provide: Storage, useValue: {} },               
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: MassageService, useValue: massageServiceStub },
        { provide: VacancyService, useValue: vacancyServiceStub },
        provideRouter(routes),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ vacancyInfo: vacancyServiceStub })
          }
        },
        // { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loading vacancy', () => {
    const VACANCY_ID = '1';
    const data = [
      {
        id: 1, name: 'Ivan', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_message: ''
      }
    ] ;   
   
    if (VACANCY_ID){
      vacancyService?.getOneFirebase(VACANCY_ID).subscribe(result => {
        expect(result).toEqual(data);
      });
    }
    expect(component).toBeTruthy();
  });

  
});
