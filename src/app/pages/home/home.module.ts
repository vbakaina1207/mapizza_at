import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { CarouselComponent } from '../../components/carousel/carousel.component';




@NgModule({
    declarations: [
      HomeComponent,
      CarouselComponent,
    ],
    exports: [
      HomeComponent,
      CarouselComponent,
    ],
    imports: [
        CommonModule,
        HomeRoutingModule,
        SharedModule,
        NgbCarouselModule
    ]
})
export class HomeModule { }
