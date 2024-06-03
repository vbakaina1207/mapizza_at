import { inject } from '@angular/core';
import {  
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
  ResolveFn
} from '@angular/router';
import { Observable, of } from 'rxjs';

import { VacancyService } from './vacancy.service';
import { IVacancyResponse } from '../../interfaces/vacancy/vacancy.interface';


export const VacancyInfoResolver: ResolveFn<Observable<IVacancyResponse>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
  ) => {
    const id = route.paramMap.get('id');
    if (id) {
      return inject(VacancyService).getOneFirebase(id) as Observable<IVacancyResponse>;
    }
    return of({} as IVacancyResponse);
}
