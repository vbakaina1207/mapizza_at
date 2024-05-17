import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductInfoComponent } from './product-info/product-info.component';
import { ProductInfoResolver } from '../../shared/services/product/product-info.resolver';


const routes: Routes = [
  {
    path: '', component: ProductComponent
  },
  {
    path: ':id',
    component: ProductInfoComponent,
    resolve: {
      discountInfo: ProductInfoResolver
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }

