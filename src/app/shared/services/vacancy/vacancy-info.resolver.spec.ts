import { TestBed } from '@angular/core/testing';
import { VacancyInfoResolver } from './vacancy-info.resolver';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { IVacancyResponse } from '../../interfaces/vacancy/vacancy.interface';
import { VacancyService } from './vacancy.service';

describe('VacancyInfoResolver', () => {
  let vacancyServiceMock: any;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(async() => {
    vacancyServiceMock = {
      getOneFirebase: jasmine.createSpy('getOneFirebase').and.returnValue(of({} as IVacancyResponse))
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: VacancyService, useValue: vacancyServiceMock }
      ]
    }).compileComponents();
   
    route = new ActivatedRouteSnapshot();
    state = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(VacancyInfoResolver).toBeTruthy();
  });
});
