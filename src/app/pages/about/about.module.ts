import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { SharedModule } from '../../shared/shared.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { AboutRoutingModule } from './about-routing.module';
import { SlideAboutModule } from '../../components/slide-about/slide-about.module';
import { ContactModule } from '../contact/contact.module';



@NgModule({
  declarations: [
    AboutComponent,
  ],
  exports: [
    AboutComponent,
    ContactModule,
    SlideAboutModule 
  ],
  imports: [
    CommonModule,
    AboutRoutingModule,
    SharedModule,
    NgbCarouselModule,
    ContactModule,
    SlideAboutModule 
  ]
})
export class AboutModule { }
