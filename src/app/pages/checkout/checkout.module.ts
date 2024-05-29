import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { CheckoutRoutingModule } from './checkout-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DeliveryModule } from '../delivery/delivery.module';
import { MapModule } from '../../components/map/map.module';



@NgModule({
  declarations: [
    CheckoutComponent
  ],
  exports: [
    MapModule
  ],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    SharedModule,
    MapModule
  ]
})
export class CheckoutModule { }
