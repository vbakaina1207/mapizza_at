import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminDiscountComponent } from './admin-discount/admin-discount.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminProductTypeComponent } from './admin-product-type/admin-product-type.component';
import { SharedModule } from '../shared/shared.module';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminAdditionTypeComponent } from './admin-addition-type/admin-addition-type.component';
import { AdminVacancyComponent } from './admin-vacancy/admin-vacancy.component';


@NgModule({
  declarations: [
    AdminComponent,
    AdminProductComponent,
    AdminProductTypeComponent,
    AdminCategoryComponent,
    AdminDiscountComponent,
    AdminOrdersComponent,
    AdminAdditionTypeComponent,
    AdminVacancyComponent  
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }

