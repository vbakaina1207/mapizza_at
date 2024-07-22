import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProductResponse } from '../../../shared/interfaces/product/product.interface';
import { AccountService } from '../../../shared/services/account/account.service';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';


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
    private router: Router,
    public accountService: AccountService,
    private afs: Firestore,
    private cdr: ChangeDetectorRef
  ) {
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        this.loadUser();   
        this.getFavorite();     
      }
    })
  }

  ngOnInit() {
    this.loadUser();
    this.getFavorite();
  }

  loadUser(): void {
    if(localStorage.length > 0 && localStorage.getItem('currentUser') !== undefined){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') as string);            
    }
  }

  ingredientClick(): void {
    this.isFullText = !this.isFullText;
  }

//   getFavorite():void{
//     if ( this.currentUser) {
//     getDoc(doc(this.afs, "users", this.currentUser.uid)).then((user_doc) => {                
//         this.favoriteProducts = user_doc.get('favorite');        
//       })
//     }
//     if (this.favoriteProducts.length == 0) this.favoriteProducts = this.currentUser.favorite;
//     console.log (this.favoriteProducts, 'this.favoriteProducts');
// }

async getFavorite() {
  if (this.currentUser && this.currentUser.uid) {
    try {
      const userDoc = await getDoc(doc(this.afs, "users", this.currentUser?.uid));
      this.favoriteProducts = userDoc.get('favorite') || [];
      this.cdr.detectChanges(); // Explicitly trigger change detection
    } catch (error) {
      console.error('Failed to get favorite products', error);
    }
  }
  if (this.favoriteProducts.length === 0 && this.currentUser.favorite) {
    this.favoriteProducts = this.currentUser.favorite;
    this.cdr.detectChanges(); // Explicitly trigger change detection
  }
}
}
