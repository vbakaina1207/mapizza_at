import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';

import { ProductComponent } from './product.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { SlideProductComponent } from '../../components/slide-product/slide-product.component';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button'; 
import { ImageModule } from 'primeng/image'; 






@NgModule({
  declarations: [
    ProductComponent,
    ProductInfoComponent,
    SlideProductComponent
  ],
  exports: [
    ProductComponent,
    /* SlideAboutModule */
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    /* SlideAboutModule,*/
    CarouselModule,
    ButtonModule, 
    ImageModule, 
    NgbCarouselModule
  ]
})
export class ProductModule { }
