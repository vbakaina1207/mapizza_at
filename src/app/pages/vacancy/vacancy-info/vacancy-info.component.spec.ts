/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';


import { VacancyInfoComponent } from './vacancy-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { Storage } from '@angular/fire/storage';
import { of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { VacancyService } from '../../../shared/services/vacancy/vacancy.service';
import { ImageService } from '../../../shared/services/image/image.service';
import { MassageService } from '../../../shared/services/massage/massage.service';


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
        RouterTestingModule,
        ReactiveFormsModule,             
      ],
      providers: [
        ImageService  ,
        { provide: Storage, useValue: {} },               
        // { provide: Firestore, useValue: {} },
        { provide: ToastrService, useValue: {} },
        { provide: MassageService, useValue: massageServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ vacancyInfo: vacancyServiceStub })
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VacancyInfoComponent);
    component = fixture.componentInstance;
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
    ]    
    if (VACANCY_ID){
      vacancyService?.getOneFirebase(VACANCY_ID).subscribe(result => {
        expect(result).toEqual(data);
      });
    }
    expect(component).toBeTruthy();
  });
});