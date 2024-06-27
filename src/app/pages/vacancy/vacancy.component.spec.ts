/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { VacancyComponent } from './vacancy.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { VacancyService } from '../../shared/services/vacancy/vacancy.service';



describe('VacancyComponent', () => {
  let component: VacancyComponent;
  let fixture: ComponentFixture<VacancyComponent>;

  
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

  beforeEach((async () => {
    await TestBed.configureTestingModule({
      declarations: [VacancyComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,       
      ],
      providers: [       
        { provide: VacancyService, useValue: vacancyServiceStub }
      ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  

  it('should create',  () => {
    expect(component).toBeTruthy();
  });

  it('should get all vacancies', () => {
    const fixture = TestBed.createComponent(VacancyComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(VacancyService);
    spyOn(service,"getAllFirebase").and.callFake(() => {
      return of([]);
    });
    app.getVacancy();
    expect(app.userVacancy).toEqual([]);
  });
});