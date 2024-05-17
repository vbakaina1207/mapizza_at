import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CabinetRoutingModule } from './cabinet-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CabinetComponent } from './cabinet.component';
import { PersonalComponent } from './personal/personal.component';
import { HistoryComponent } from './history/history.component';
import { PasswordComponent } from './password/password.component';
import { FavoriteComponent } from './favorite/favorite.component';



@NgModule({
  declarations: [
    CabinetComponent,
    PersonalComponent,
    HistoryComponent,
    PasswordComponent,
    FavoriteComponent
  ],
  imports: [
    CommonModule,
    CabinetRoutingModule,
    SharedModule
  ]
})
export class CabinetModule { }
