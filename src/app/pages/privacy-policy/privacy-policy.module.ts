import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrivacyPolicyComponent } from './privacy-policy.component';
import { SharedModule } from '../../shared/shared.module';
import { PrivacyPolicyRoutingRoutingModule } from './privacy-policy-routing.module';



@NgModule({
  declarations: [PrivacyPolicyComponent],
  imports: [
    CommonModule,
    SharedModule,
    PrivacyPolicyRoutingRoutingModule
  ]
})
export class PrivacyPolicyModule { }
