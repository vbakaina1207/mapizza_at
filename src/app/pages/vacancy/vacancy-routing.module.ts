import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VacancyComponent } from './vacancy.component';
import { VacancyInfoComponent } from './vacancy-info/vacancy-info.component';
import { VacancyInfoResolver } from '../../shared/services/vacancy/vacancy-info.resolver';



const routes: Routes = [
  {
    path: '', component: VacancyComponent
  },
  {
    path: ':id',
    component: VacancyInfoComponent,
    resolve: {
        vacancyInfo: VacancyInfoResolver
      }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacancyRoutingModule { }
