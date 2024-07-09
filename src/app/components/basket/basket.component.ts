import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';
import { OrderService } from '../../shared/services/order/order.service';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.scss']
})
export class BasketComponent implements OnInit {
public total = 0;
  public count = 0;
  public bonus = 0;
  public basket: Array<IProductResponse> = [];
  public currentUser!: any;
  public additionProduct: Array<ITypeAdditionResponse> = [];
  public isAddition: boolean = false;

  constructor(
    private orderService: OrderService,
    private dialog: MatDialog,
    private toastr: ToastService
    ){
  }

  ngOnInit() {
    this.loadUser();
    this.loadBasket();
    this.updateBasket();
  }

  loadBasket(): void {
    if(localStorage?.length > 0 && localStorage.getItem('basket')){
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    }
    this.getTotalPrice();
    console.log(this.basket);
  }

  getTotalPrice(): void {
    this.total = this.basket
      ?.reduce((total: number, prod: IProductResponse) =>total + prod.count *(Number(prod.price) + Number(prod.addition_price ? prod.addition_price : 0)), 0);
    this.count = this.basket
      ?.reduce((totalCount: number, prod: IProductResponse) => totalCount + prod.count, 0); 
    this.bonus = this.basket
      ?.reduce((bonus: number, prod: IProductResponse) => bonus + prod.bonus*prod.count, 0); 
  }

  loadUser(): void {
    if(localStorage.length > 0 && localStorage.getItem('currentUser')){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
    } 
  }

  updateBasket(): void {
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket();
    })
  }

  productCount(product: IProductResponse, value: boolean): void {
    if(value){
      ++product.count;
    } else if(!value && product.count > 1){
      --product.count;
    }
    this.addToBasket(product, value);
  }


  addToBasket(product: IProductResponse, value: boolean): void {
    let basket: Array<IProductResponse> = [];
    if(localStorage?.length > 0 && localStorage.getItem('basket')){
        basket = JSON.parse(localStorage.getItem('basket') as string);
        const existingProductIndex = basket.findIndex(prod => prod.id === product.id && this.areSelectedAdditionsEqual(prod.selected_addition, product.selected_addition));

        if(existingProductIndex !== -1){      
            if (value) {
                basket[existingProductIndex].count += 1;
            } else if (!value && basket[existingProductIndex].count > 1) {
                basket[existingProductIndex].count -= 1;
            }
        } else {            
            basket.push(product);
        }
    } else {      
        basket.push(product);
    }    
    localStorage.setItem('basket', JSON.stringify(basket));    
    product.count = 1;
    this.orderService.changeBasket.next(true);
}

// Function to check if the selected additions of two products are equal
    areSelectedAdditionsEqual(additions1: Array<ITypeAdditionResponse>, additions2: Array<ITypeAdditionResponse>): boolean {
    // Sort the additions arrays to ensure consistent comparison
    const sortedAdditions1 = additions1.slice().sort();
    const sortedAdditions2 = additions2.slice().sort();
    
    // Compare the sorted arrays
    return JSON.stringify(sortedAdditions1) === JSON.stringify(sortedAdditions2);
}

  removeFromBasket(product: IProductResponse): void{
    this.dialog.open(AlertDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'alert-dialog',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to remove product?',
        icon: '',
        isError: true
      }
    }).afterClosed().subscribe(result => {
      console.log(result);
      if (result) {        
        let basket: Array<IProductResponse> = [];
        if(localStorage?.length > 0 && localStorage.getItem('basket')){
          basket = JSON.parse(localStorage.getItem('basket') as string);
          if(basket.some(prod => prod.id === product.id)){
            const index = basket.findIndex(prod => prod.id === product.id);
            basket.splice(index,1);            
          }
          this.toastr.showSuccess('', 'Product successfully deleted');
          localStorage.setItem('basket', JSON.stringify(basket));
          this.orderService.changeBasket.next(true);
        }
      }
    })
    
  }

  openLoginDialog(): void {
    this.dialog.open(AuthDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'auth-dialog',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      console.log(result);
    })
  }


  
  additionDeleteClick(product: IProductResponse, additionName: any): void {
    if(localStorage?.length > 0 && localStorage.getItem('basket')){
      let basket = JSON.parse(localStorage.getItem('basket') as string);
    
    // Find the index of the product in the basket array
    const productIndex = this.findProductIndexInBasket(product);
    
    if (productIndex !== -1) {      
        for (let i = 0; i < basket.length; i++) {           
            if (basket[i].id === product.id && this.areAdditionsEqual(basket[i].selected_addition, product.selected_addition)) {               
                basket[i].addition_price -= Number(product.selected_addition.find(addition => addition.name === additionName)?.price || 0);                
                const additionIndex = basket[i].selected_addition.findIndex((addition: { name: any; }) => addition.name === additionName);
                if (additionIndex !== -1) {
                    basket[i].selected_addition.splice(additionIndex, 1);
                }    
                if (!basket[i].selected_addition.length) basket[i].addition_price = 0;            
                this.updateProductInBasket(basket[i], i);               
                break;
            }
        }
    }
  }
}

// Helper function to compare two arrays of selected additions
areAdditionsEqual(arr1: Array<ITypeAdditionResponse>, arr2: Array<ITypeAdditionResponse>): boolean {
    // Convert arrays to JSON strings for comparison
    const str1 = JSON.stringify(arr1);
    const str2 = JSON.stringify(arr2);
    return str1 === str2;
}


// Helper function to find the index of the product in the basket array
findProductIndexInBasket(product: IProductResponse): number {
    if (localStorage?.length > 0 && localStorage.getItem('basket')) {        
        let basket = JSON.parse(localStorage.getItem('basket') as string);        
        return basket.findIndex((prod: { id: string | number; }) => prod.id === product.id);
    }   
    return -1;
}


updateProductInBasket(product: IProductResponse, index: number): void {
    if (localStorage?.length > 0 && localStorage.getItem('basket')) {
        let basket = JSON.parse(localStorage.getItem('basket') as string);
        basket.splice(index, 1, product);
        localStorage.setItem('basket', JSON.stringify(basket));
        this.orderService.changeBasket.next(true);
    }
  }



}

