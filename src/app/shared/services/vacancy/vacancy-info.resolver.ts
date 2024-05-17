import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { IVacancyResponse } from '../../interfaces/vacancy/vacancy.interface';
import { VacancyService } from './vacancy.service';

@Injectable({
  providedIn: 'root'
})
export class VacancyInfoResolver implements Resolve<IVacancyResponse> {

  constructor(private vacancyService: VacancyService){}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IVacancyResponse> {
    return this.vacancyService.getOneFirebase((route.paramMap.get('id') as string)) as Observable<IVacancyResponse>;
  }
}
