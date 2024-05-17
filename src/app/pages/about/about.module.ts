import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AboutRoutingModule } from './about-routing.module';



@NgModule({
  declarations: [
    AboutComponent,
  ],
  exports: [
    AboutComponent,
    /* ContactModule,
    SlideAboutModule, */
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    NgbCarouselModule,
    /* ContactModule,
    SlideAboutModule */
  ]
})
export class AboutModule { }
