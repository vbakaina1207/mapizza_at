import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { VacancyComponent } from './vacancy.component';
import { VacancyInfoComponent } from './vacancy-info/vacancy-info.component';
import { ContactModule } from '../../pages/contact/contact.module';
import { VacancyRoutingModule } from './vacancy-routing.module';
import { SharedModule } from '../../shared/shared.module';




@NgModule({
  declarations: [
    VacancyComponent,
    VacancyInfoComponent,
  ],
  exports: [
    VacancyComponent,
    ContactModule,
  ],
  imports: [
    CommonModule,
    VacancyRoutingModule,
    SharedModule,
    ContactModule,
    NgbCarouselModule
  ]
})
export class VacancyModule { }
