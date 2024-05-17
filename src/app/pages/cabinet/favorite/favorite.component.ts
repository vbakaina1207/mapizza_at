import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductResponse } from '../../../shared/interfaces/product/product.interface';


@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {
  private eventSubscription!: Subscription;
  public currentUser: any;
  public favoriteProducts: Array<IProductResponse> = [];
  public isFullText: boolean = false;
  constructor(
    private router: Router
  ) {
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        this.loadUser();        
      }
    })
  }

  ngOnInit() {
    this.loadUser();
  }

  loadUser(): void {
    if(localStorage.length > 0 && localStorage.getItem('currentUser')){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
      this.favoriteProducts = this.currentUser.favorite;
    }
  }

  ingredientClick(): void {
    this.isFullText = !this.isFullText;
  }
}
