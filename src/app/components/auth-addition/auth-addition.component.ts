import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';
import { AccountService } from '../../shared/services/account/account.service';
import { AdditionProductService } from '../../shared/services/addition-product/addition-product.service';
import { OrderService } from '../../shared/services/order/order.service';
import { ProductService } from '../../shared/services/product/product.service';
import { ToastService } from '../../shared/services/toast/toast.service';


@Component({
  selector: 'app-auth-addition',
  templateUrl: './auth-addition.component.html',
  styleUrls: ['./auth-addition.component.scss']
})
export class AuthAdditionComponent implements OnInit {

  public currentProduct = <IProductResponse>{} ||
    null || undefined;
  public additionProducts: Array<ITypeAdditionResponse> = [];
  private eventSubscription!: Subscription;
  public additionProduct: Array<ITypeAdditionResponse> = [];
  public additionPrice: number = 0;
  public activeAddition: string = '';
  public isAddition: boolean = false;
  public isTabSouce: boolean = true;
  public isFavorite!: boolean;
  public favoriteProducts: Array<IProductResponse> = [];
  public btnName: string = 'order';
  public isOrder: boolean = false;
  public currentUser!: any;
  public favorite: Array<IProductResponse> = [];
  public display_addition_price: string='0';
  public activeIngredients: { [key: string]: boolean } = {};


  constructor(
    private router: Router,
    private accountService: AccountService,
    private additionProductService: AdditionProductService,
    private orderService: OrderService,
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastService,
    private afs: Firestore,
  ) { 
    this.eventSubscription = this.router.events.subscribe(event => {
    if(event instanceof NavigationEnd ) {
      this.loadUser();
      this.loadTypeAddition();
      this.loadProduct();     
      this.activatedRoute.data.subscribe(response => {
        this.currentProduct = response['productInfo'];        
      })
    }
  })
  }

  ngOnInit() {
    this.loadUser();
    this.loadTypeAddition();
    this.loadProduct();
    this.updateFavorite();
    this.loadFavoriteProduct();
  }

  loadUser(): void {
    if(localStorage.length > 0 && localStorage.getItem('currentUser')){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') as string); 
      this.favorite = this.currentUser.favorite;
    }
  }

  loadTypeAddition(): void {
    this.additionProductService.getAllBySauceFirebase(this.isTabSouce).subscribe(data => {
      this.additionProducts = data as ITypeAdditionResponse[];
    })
  }

  loadProduct(): void {
    const PRODUCT_ID = this.accountService.PRODUCT_ID;
    this.productService.getOneFirebase(PRODUCT_ID).subscribe(data => {
      this.currentProduct = data as IProductResponse;  
    })    
  }

  loadFavoriteProduct(): void {
    const PRODUCT_ID = this.accountService.PRODUCT_ID;
    if (localStorage?.length > 0 && localStorage.getItem('favorite')) {
      if (this.favorite?.length == 0) this.favorite = JSON.parse(localStorage.getItem('favorite') as string);
    }
    let index = this.favorite?.findIndex(prod => prod.id === PRODUCT_ID);
    if (index !== -1)
      this.isFavorite = true;
  }

 


 additionDeleteClick(additionName: any): void {
  let removed = false; 
  for (let i = 0; i < this.additionProduct.length; i++) {
      if (this.additionProduct[i].name === additionName) {
          let ind = this.additionProduct.indexOf(this.additionProduct[i]);
          this.additionPrice -= Number(this.additionProduct[i].price);
          if (ind >= 0) {
              this.additionProduct.splice(ind, 1);
              removed = true;
          }
      }
  }
  if (removed) {
      this.isAddition = this.additionProduct.length > 0;
      this.display_addition_price = this.additionPrice.toFixed(2);
      this.activeIngredients[additionName] = !this.activeIngredients[additionName];
      console.log(this.activeIngredients);
      const elements = document.querySelectorAll('.ingredient');
      elements.forEach((elem: Element) => {
          const titleElement = elem.querySelector('.ingredient_title');
          const titleText = titleElement?.textContent?.trim();
          if (titleText === additionName) {
              elem.classList.remove('active');
              elem.querySelector('.ingredient_action')?.classList.remove('active-ingradient');
          }
      });
  }
}






additionClick(additionName: any): void {
  this.activeAddition = additionName;
  this.activeIngredients[additionName] = !this.activeIngredients[additionName];
  const selectedProduct = this.additionProducts.find(product => product.name === additionName);
  if (selectedProduct) {
      const index = this.additionProduct.findIndex(product => product.name === additionName);
      if (this.activeIngredients[additionName]) {
          if (index === -1) {
              this.additionProduct.push(selectedProduct);
              this.additionPrice += Number(selectedProduct.price);
          }
      } else {
          if (index !== -1) {
              this.additionProduct.splice(index, 1);
              this.additionPrice -= Number(selectedProduct.price);
          }
      }
  }
  this.isAddition = this.additionProduct.length > 0;
  this.display_addition_price = this.additionPrice.toFixed(2);
  this.currentProduct.addition_price = Math.round(this.additionPrice);
}



additionDeleteAllClick(): void {
    this.additionProduct = [];
    this.additionPrice = 0;
    this.isAddition = false;
    this.activeIngredients = {};
    document.querySelectorAll('.addition').forEach((el) => {
        el.classList.remove("active");
        el.querySelector('.ingredient_action')?.classList.remove('active-ingradient');
    });
    this.display_addition_price = this.additionPrice.toFixed(2);
    this.currentProduct.addition_price = this.additionPrice;
}




  productCount(product: IProductResponse, value: boolean): void {
    if(value){
      ++product.count;
    } else if(!value && product.count > 1){
      --product.count;
    }
  }

  addToBasket(product: IProductResponse): void {   
    let addition_price = 0;
    product.selected_addition = product.selected_addition || [];
    product.selected_addition.splice(0, product.selected_addition.length);
    this.additionProduct.forEach(function (item) {
      product.selected_addition.push(item);
    });

    const sameEntries = (x:any, y:any) => {
      const xEntries = Object.entries(x);
      if (xEntries.length !== Object.entries(y).length) return false;
      return xEntries.every(([k, v]) => y[k] === v);
    }
    const sameArrays = (arr1: Array<ITypeAdditionResponse>, arr2:Array<ITypeAdditionResponse>) =>
      arr1.length === arr2.length && arr1.every((x, i) => sameEntries(x, arr2[i]));

    let idAdd = false;
    let index = 0;
    let basket: Array<IProductResponse> = [];
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      basket = JSON.parse(localStorage.getItem('basket') as string);
      basket.forEach(function (prod) {
        if (prod.id === product.id) {
          prod.selected_addition = prod.selected_addition || [];
          if (prod.id === product.id && sameArrays(prod.selected_addition, product.selected_addition)) {
            idAdd = true;
            index = basket.findIndex(prod => prod.id === product.id && sameArrays(prod.selected_addition, product.selected_addition));
            addition_price += addition_price; 
            console.log('2', index, 'index');
          }
        }
      })
      if (idAdd) {
        basket[index].count += product.count;
        console.log(basket[index].count, 'count');
      }
      else {
        console.log(product.count, 'product count');    
        basket.push(product);
          }
    }
    else {     
      basket.push(product);       
    }
    this.isOrder = true;
    localStorage.setItem('basket', JSON.stringify(basket));
    this.toastr.showSuccess('',product.category.name + ' ' +  product.name + ' successfully added to basket');
    product.count = 1;
    this.orderService.changeBasket.next(true);    
    this.additionDeleteAllClick();
    product = product;
    this.isAddition = false;
    this.btnName = '';
    
    setTimeout(() => { this.btnName = 'order', this.isOrder = false }, 2000 );
  }

  tabSouceClick(): void {
    this.isTabSouce = true;
    this.loadTypeAddition();
  }

  tabAdditionClick(): void {
    this.isTabSouce = false;
    this.loadTypeAddition();
  }

  buttonFavoriteClick(product: IProductResponse): void {
    this.isFavorite = !this.isFavorite;
      if (this.isFavorite) {
        this.favorite.push(product);
        localStorage.setItem('favorite', JSON.stringify(this.favorite));
      } else {
        if (this.favorite?.some(prod => prod.id === product.id)) {
          const index = this.favorite.findIndex(prod => prod.id === product.id);
          this.favorite.splice(index, 1);
        }
      }
      localStorage.setItem('favorite', JSON.stringify(this.favorite));
      this.accountService.changeFavorite.next(true);
      this.currentUser.favorite = this.favorite;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser)); 
      this.updateDoc();
  }


  async updateDoc(): Promise<any> {
    this.currentUser.favorite = this.favorite;
    const user = this.currentUser;
    setDoc(doc(this.afs, 'users', this.currentUser.uid), user, { merge: true });
    localStorage.setItem('currentUser', JSON.stringify( user));
  }

  updateFavorite(): void {
    this.accountService.changeFavorite.subscribe(() => {
      this.loadFavoriteProduct;      
    });
    this.accountService.changeCurrentUser.subscribe(() => {
      this.loadUser();
    })
  }

}
