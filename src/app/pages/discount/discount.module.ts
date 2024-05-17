import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountInfoComponent } from './discount-info/discount-info.component';
import { DiscountComponent } from './discount.component';
import { DiscountRoutingModule } from './discount-routing.module';
import { SharedModule } from '../../shared/shared.module';



@NgModule({
  declarations: [
    DiscountComponent,
    DiscountInfoComponent
  ],
  imports: [
    CommonModule,
    DiscountRoutingModule,
    SharedModule
  ]
})
export class DiscountModule { }
