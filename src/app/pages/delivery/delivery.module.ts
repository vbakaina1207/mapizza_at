import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryComponent } from './delivery.component';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapModule } from '../../components/map/map.module';


@NgModule({
  declarations: [
    DeliveryComponent,    
  ],
  exports: [
    MapModule
  ],
  imports: [
    CommonModule,
    DeliveryRoutingModule,
    SharedModule,
    GoogleMapsModule,
    MapModule
  ]
})
export class DeliveryModule { }
