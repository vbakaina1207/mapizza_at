import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { ROLE } from '../../constants/role.constant';
import { Injectable, inject } from '@angular/core';



@Injectable({ providedIn: 'root' })

export class AuthGuardService{

  public currentUser!: any;
  

   constructor(
    private router: Router
  ) {} 

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):  boolean  {
      if (localStorage.getItem('currentUser') as string !== undefined) this.currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
   
      if(this.currentUser && (this.currentUser.role === ROLE.ADMIN || this.currentUser.role === ROLE.USER)){
        return true;
      }
      this.router.navigate(['']);
      return false;
    }

}
 
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject( AuthGuardService).canActivate(route, state);
} 



