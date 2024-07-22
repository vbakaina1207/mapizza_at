import { Component, OnInit,  OnDestroy, ElementRef, AfterContentInit, DoCheck } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ICategoryResponse } from "../../../shared/interfaces/category/category.interface";
import { MatDialog } from '@angular/material/dialog';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { IProductResponse } from '../../../shared/interfaces/product/product.interface';
import { ITypeAdditionResponse } from '../../../shared/interfaces/type-addition/type-addition.interfaces';
import { ProductService } from '../../../shared/services/product/product.service';
import { OrderService } from '../../../shared/services/order/order.service';
import { AccountService } from '../../../shared/services/account/account.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { AuthAdditionComponent } from '../../../components/auth-addition/auth-addition.component';



@Component({
  selector: 'app-product-info',
  templateUrl: './product-info.component.html',
  styleUrls: ['./product-info.component.scss']
})
export class ProductInfoComponent implements OnInit {

  public currentProduct = <IProductResponse>{} ||
    null || undefined;
  public currentCategoryName!: string;
  public currentProductCategory = <ICategoryResponse>{} || null || undefined;
  private eventSubscription!: Subscription;
  public isAddition: boolean = false;
  public isAddProduct: boolean = false;
  public activeAddition: string = '';
  public additionProduct: Array<ITypeAdditionResponse> = [];
  public additionPrice: number = 0;
  public idAdd: boolean = false;
  public isFavorite!: boolean;
  public favoriteProducts: Array<IProductResponse> = [];
  public currentUser!: any;
  public btnName: string = 'order';
  public isOrder: boolean = false;
  public favorite: Array<IProductResponse> = [];
  public display_addition_price: string = '0';
  

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private accountService: AccountService,
    private router: Router,
    public dialog: MatDialog,
    private afs: Firestore,
    private toastr: ToastService
  ) {
    this.eventSubscription = this.router.events.subscribe(event => {
    if(event instanceof NavigationEnd ) {
      this.loadUser();
      this.loadProduct();      
      this.loadFavoriteProduct(); 
      this.updateFavorite();
      this.activatedRoute.data.subscribe(response => {
        this.currentProduct = response['productInfo'];
        this.currentProductCategory = this.currentProduct?.category;
      })
    }
  })
  }

  ngOnInit(): void {      
  }


      
async getFavorite() {
  if (this.currentUser) {
    try {
      const userDoc = await getDoc(doc(this.afs, "users", this.currentUser.uid));
      this.favorite = userDoc.get('favorite') || [];
      // this.cdr.detectChanges(); // Explicitly trigger change detection
    } catch (error) {
      console.error('Failed to get favorite products', error);
    }
  }
}
  

  loadFavoriteProduct(): void {
    this.getFavorite();
    if (this.favorite.length === 0 && this.currentUser?.favorite)
    if (localStorage?.length > 0 && localStorage.getItem('favorite') !== undefined) {
      if (this.favorite?.length == 0) this.favorite = JSON.parse(localStorage.getItem('favorite') as string);
    };  
        const PRODUCT_ID = (this.activatedRoute.snapshot.paramMap.get('id') as string);
        let index = this.favorite?.findIndex(prod => prod.id === PRODUCT_ID);    
        if (index > -1) 
          this.isFavorite = true;
  }

  loadProduct(): void {
    const PRODUCT_ID = (this.activatedRoute.snapshot.paramMap.get('id') as string);
    this.accountService.PRODUCT_ID = PRODUCT_ID;
    this.productService.getOneFirebase(PRODUCT_ID).subscribe(data => {
      this.currentProduct = data as IProductResponse;
    })    
  }

  // loadUser(): void {
  //   if(localStorage.length > 0 && localStorage.getItem('currentUser')){
  //     this.currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
  //     this.favorite = this.currentUser.favorite;
  //   }
  // }
  loadUser(): void {
    const currentUserStr = localStorage.getItem('currentUser') as string;
    if (currentUserStr && currentUserStr !== 'undefined') {
      try {
        this.currentUser = JSON.parse(currentUserStr);
        if (this.currentUser) this.favorite = this.currentUser.favorite;
      } catch (error) {
        console.error('Failed to parse currentUser from localStorage', error);      
      }
    } 
  }


  equalArray(x: any, y: any): void {
      const xEntries = Object.entries(x);
      if (xEntries.length !== Object.entries(y).length) this.idAdd= false;
      this.idAdd = xEntries.every(([k, v]) => y[k] === v);
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
    const sameEntries = (x: any, y: any) => {
      const xEntries = Object.entries(x);
      if (xEntries.length !== Object.entries(y).length) return false;
      return xEntries.every(([k, v]) => y[k] === v);
    }
    const sameArrays = (arr1: Array<ITypeAdditionResponse>, arr2: Array<ITypeAdditionResponse>) =>
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
          }
        }
      })
      if (idAdd) {
        basket[index].count += product.count;
      }
      else {
        basket.push(product);
      }
      this.isOrder = true;
    }
    else {
      basket.push(product);
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    this.toastr.showSuccess('', product.category.name + ' ' + product.name + ' successfully added to basket');
    product.count = 1;
    this.orderService.changeBasket.next(true);
    this.additionDeleteAllClick();
    product = product;
    this.btnName = '';
    setTimeout(() => { this.btnName = 'order', this.isOrder = false }, 2000 );
    
  }


    
    
    additionClick(additionName: any): void {  
    this.activeAddition = additionName;
    let elem = document.querySelectorAll('.ingredient');
    let elemIng = document.querySelectorAll('.ingredient_action');
    for (let i = 0; i < elem.length; i++) {
      if (this.currentProduct.type_addition[i].name == additionName) {
        elem[i]?.classList.toggle('active');
        elemIng[i]?.classList.toggle('active-ingradient');
        if (elem[i].classList.contains('active')) {
          this.additionProduct.push(this.currentProduct.type_addition[i]);
          this.additionPrice +=  Number(this.currentProduct.type_addition[i].price);          
        } else
        {
          let ind = this.additionProduct.indexOf(this.currentProduct.type_addition[i]);
          this.additionPrice = this.additionPrice - Number(this.currentProduct.type_addition[i].price);
          if (ind >= 0) this.additionProduct.splice( ind, 1);
        }
        if (this.additionProduct.length > 0) {
          this.isAddition = true;
        } else {
          this.isAddition = false;
        }
        this.currentProduct.addition_price = this.additionPrice;
        this.display_addition_price = this.currentProduct.addition_price.toFixed(2);   
        
      }
    } 
  }
 
 
  additionDeleteClick(additionName: any): void {
    this.additionClick(additionName);
}

  
 
  isAdditionProduct(product: ITypeAdditionResponse): boolean {
    return this.additionProduct?.some((additionProduct: ITypeAdditionResponse) => additionProduct.name === product.name);
}
 
  additionDeleteAllClick(): void{
    this.additionProduct.splice(0, this.additionProduct.length);
    this.additionPrice = 0;
    this.isAddition = false;
    document.querySelectorAll('.ingredient').forEach((el) =>
      el.classList.remove("active"));
    document.querySelectorAll('.ingredient_action').forEach((el) =>
      el.classList.remove("active-ingradient"));
    this.currentProduct.addition_price = this.additionPrice;
    this.display_addition_price = this.currentProduct.addition_price.toFixed(2);
  }

  openAdditionDialog(): void {
      this.dialog.open(AuthAdditionComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'auth-addition-dialog',
        autoFocus: false
      }).afterClosed().subscribe(result => {          
          if (localStorage?.length > 0 && localStorage.getItem('favorite')) {
            this.favorite = JSON.parse(localStorage.getItem('favorite') as string);
          };
          if (this.favorite.length == 0) this.isFavorite = false;
          else {
            const ind = this.favorite.findIndex(prod => prod.id === this.currentProduct.id);
            if (ind > -1) {
              this.isFavorite = true;         
            } else this.isFavorite = false; 
          }                       
        console.log(this.isFavorite, this.favorite, 'infoFavorite');
        console.log(result);
      })    
  }
  
  buttonFavoriteClick(product: IProductResponse): void{
    this.isFavorite = !this.isFavorite;
      if (this.isFavorite) {
        this.favorite?.push(product);
        localStorage.setItem('favorite', JSON.stringify(this.favorite));
      } else {
        if (this.favorite?.some(prod => prod.id === product.id)) {
          const index = this.favorite.findIndex(prod => prod.id === product.id);
          this.favorite.splice(index, 1);
        }
      }
    localStorage.setItem('favorite', JSON.stringify(this.favorite));
    this.accountService.changeFavorite.next(true);
    if (this.currentUser) {
      this.currentUser.favorite = this.favorite;
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }    
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
