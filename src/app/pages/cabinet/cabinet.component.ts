import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.scss']
})
export class CabinetComponent implements OnInit {

    public isOpen: boolean = false;
    public title: string = 'Personal data';
    private routerSubscription!: Subscription;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.setTitleBasedOnUrl(this.router.url);    
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setTitleBasedOnUrl(event.urlAfterRedirects);
      }
    });
    
  }


  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }


  private setTitleBasedOnUrl(url: string) {
    if (url.includes('/cabinet/favorite')) {
      this.title = 'Favorites';
    } else if (url.includes('/cabinet/personal')) {
      this.title = 'Personal data';
    } else if (url.includes('/cabinet/history')) {
      this.title = 'Order history';
    } else if (url.includes('/cabinet/password')) {
      this.title = 'Password change';
    }
  }

  openMenu():void {
    this.isOpen = !this.isOpen;
    
  }

  closeMenu(event:any):void {
    this.title = event.target.value;
  }

}
