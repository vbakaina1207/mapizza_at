import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeliveryComponent } from './delivery.component';
import { DeliveryRoutingModule } from './delivery-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MapComponent } from '../../components/map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [
    DeliveryComponent,
    MapComponent
  ],
  
  imports: [
    CommonModule,
    DeliveryRoutingModule,
    SharedModule,
    GoogleMapsModule
  ]
})
export class DeliveryModule { }
