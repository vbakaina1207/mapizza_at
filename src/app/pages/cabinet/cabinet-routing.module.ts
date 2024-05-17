import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CabinetComponent } from './cabinet.component';
import { PersonalComponent } from './personal/personal.component';
import { HistoryComponent } from './history/history.component';
import { PasswordComponent } from './password/password.component';
import { FavoriteComponent } from './favorite/favorite.component';

const routes: Routes = [
  {
    path: '', component: CabinetComponent, children: [
      {path: 'personal', component: PersonalComponent},
      {path: 'history', component: HistoryComponent},
      {path: 'password', component: PasswordComponent },
      {path: 'favorite', component: FavoriteComponent},
      {path: '', pathMatch: 'full', redirectTo: 'personal'}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CabinetRoutingModule { }
