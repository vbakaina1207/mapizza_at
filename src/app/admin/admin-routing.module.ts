
import { NgModule } from '@angular/core';
import { AdminComponent } from './admin.component';
import { AdminCategoryComponent } from './admin-category/admin-category.component';
import { AdminProductTypeComponent } from './admin-product-type/admin-product-type.component';
import { AdminAdditionTypeComponent } from './admin-addition-type/admin-addition-type.component';
import { AdminProductComponent } from './admin-product/admin-product.component';
import { AdminDiscountComponent } from './admin-discount/admin-discount.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { RouterModule, Routes } from '@angular/router';
import { AdminVacancyComponent } from './admin-vacancy/admin-vacancy.component';

export const routes: Routes = [
    {
        path: '', component: AdminComponent, children: [
          { path: 'category', component: AdminCategoryComponent },
          { path: 'product-type', component: AdminProductTypeComponent },
          { path: 'addition-type', component: AdminAdditionTypeComponent},
          { path: 'product', component: AdminProductComponent },
          { path: 'discount', component: AdminDiscountComponent },
          { path: 'order', component: AdminOrdersComponent },
          { path: 'vacancy', component: AdminVacancyComponent },
          { path: '', pathMatch: 'full', redirectTo: 'discount' }
        ]
      } 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
