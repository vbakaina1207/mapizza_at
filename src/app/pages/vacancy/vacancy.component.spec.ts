/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { VacancyComponent } from './vacancy.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { VacancyService } from '../../shared/services/vacancy/vacancy.service';
import { NavigationEnd, Router, RouterModule, Routes, provideRouter } from '@angular/router';
import { IVacancyResponse } from '../../shared/interfaces/vacancy/vacancy.interface';


@Component({
  selector: 'app-blank',
  template: '<p>Blank Component</p>'
})
class BlankComponent {}

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'test', component: BlankComponent }
];

describe('VacancyComponent', () => {
  let component: VacancyComponent;
  let fixture: ComponentFixture<VacancyComponent>;
  let vacancyService: jasmine.SpyObj<VacancyService>;
  let router: Router;

  
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
        RouterModule.forRoot( routes )       
      ],
      providers: [       
        { provide: VacancyService, useValue: vacancyServiceStub },
        provideRouter(routes)
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
    router = TestBed.inject(Router);
    vacancyService = TestBed.inject(VacancyService) as jasmine.SpyObj<VacancyService>;
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

  it('should vacancy response', async () => {
    const vacancyData: IVacancyResponse[] = [
      {
        id: '1',
        name: 'new vacancy',
        path: '',
        description: '',
        imagePath: ''
      }
    ];
    spyOn(vacancyService, 'getAllFirebase').and.returnValue(of(vacancyData));
   
    component.getVacancy();
    expect(vacancyService.getAllFirebase).toHaveBeenCalled();
    expect(component.userVacancy).toEqual(vacancyData);
  });

  it('should handle empty vacancy response', async () => {
    const vacancyData: IVacancyResponse[] = [];
    spyOn(vacancyService, 'getAllFirebase').and.returnValue(of(vacancyData));
    
    component.getVacancy();
    expect(vacancyService.getAllFirebase).toHaveBeenCalled();
    expect(component.userVacancy).toEqual([]);
  });

  it('should strip HTML tags from description', () => {
    const htmlString = '<h2>Title</h2><strong>Description</strong>';
    const expectedString = 'TitleDescription';
    expect(component.getDescription(htmlString)).toBe(expectedString);
  });

  it('should load vacancies on router NavigationEnd event', () => {
    spyOn(component, 'getVacancy').and.callThrough();
    const mockEvent = new NavigationEnd(0, 'http://localhost:4200', 'http://localhost:4200');
    (router.events as any).next(mockEvent); // Simulate a NavigationEnd event
    fixture.detectChanges();
    
    expect(component.getVacancy).toHaveBeenCalled();
    expect(vacancyService.getAllFirebase).toBeDefined();
  });

  it('should unsubscribe from router events on destroy', () => {
    spyOn(component.eventSubscription, 'unsubscribe').and.callThrough();

    component.ngOnDestroy();
    expect(component.eventSubscription.unsubscribe).toHaveBeenCalled();
  });

});