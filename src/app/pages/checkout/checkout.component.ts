import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { Firestore, arrayUnion, doc, updateDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription,} from 'rxjs';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { IOrderResponse } from '../../shared/interfaces/order/order.interface';
import { OrderService } from '../../shared/services/order/order.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { AuthDialogComponent } from '../../components/auth-dialog/auth-dialog.component';
import { ArrayType } from '@angular/compiler';
import { AccountService } from '../../shared/services/account/account.service';






@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit, OnDestroy, AfterViewInit{
  public total = 0;
  public bonus = 0;
  public count = 0;
  public basket: Array<IProductResponse> = [];
  public order: Array<IOrderResponse> = [];
  public orderForm!: FormGroup;
  public currentUser!: any;
  public isBonus: boolean = false;
  public address = [{
    typeAddress: '',
        city: '',
        street: '',
        house: '',
        entrance: '',
        floor: 0,
        flat: 0}];
  public currentOrder!: string;
  public currentNumOrder!: number;
  private eventSubscription!: Subscription;
  public house!: number;
  public sum_bonus = 0;
  public sum_order = 0;
  public select_address: string[] = [];
  public sum_delivery = 0;
  public isPizzaCount = false;
  public isPizzaCount2 = false;
  public pizzaCount: number = 0;
  public minPrice: number = 0;
  public freePizza: number = 0;
  public priceArr: Array<number> = [];
  public isBonusClick: boolean = false;
  public atTime: boolean = false;
  public isUseBonus: boolean = false;
  public isCourier: boolean = true;
  public isResult: boolean = false;
  public minPriceProduct!: IProductResponse;
  public dayOfWeek!: number;
  public countActionProduct!: number;
  public defaultAddress!: string;
  public isSelectAddress: boolean = false;
  public fullAddress: string = '';
  public isInGreenZone: boolean = false;
  public isInYellowZone: boolean = false;


  constructor(
    public orderService: OrderService,
    private fb: FormBuilder,
    private toastr: ToastService,
    public router: Router,
    private afs: Firestore,
    public dialog: MatDialog,
    private accountService: AccountService
    ) {
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        this.loadUser();    
        this.initOrderForm(); 
        this.loadBasket();
        this.getOrders();
        this.updateBasket();
          
      }
    })
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void{    
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
  
  ngAfterViewInit() {
  }

  getOrders(): void {
    this.orderService.getAllFirebase().subscribe((data) => {
      this.order = data as IOrderResponse[];            
      if (this.order && this.order.length > 0) {
        this.currentNumOrder = this.order[0]?.order_number ? this.order[0].order_number + 1 : 1;
        this.currentOrder = this.order[0]?.id;
        this.orderForm.patchValue({ order_number: this.currentNumOrder });
      }
    })
  }


  initOrderForm(): void {    
    const currentDate = new Date().toISOString().split('T')[0];
    this.orderForm = this.fb.group({
      order_number: [this.currentNumOrder],
      uid: [this.currentUser?.uid || null],
      date_order: [new Date()],
      status: false,
      total: [this.total],
      product: [this.basket],
      name: [this.currentUser['firstName'] || null, Validators.required],
      phone: [this.currentUser['phoneNumber'] || null, Validators.required],
      email: [this.currentUser['email'] || null, Validators.required],
      delivery_method: ['courier', Validators.required],
      payment_method: ['cod', Validators.required],
      cash: [null],
      isWithoutRest: [true],
      at_time: [false],
      delivery_date: [currentDate],
      delivery_time: [null],
      self_delivery_address: [null],
      city: [this.select_address[0] || null],
      street: [this.select_address[1] || null],
      house: [this.select_address[2] || null],
      entrance: [this.select_address[4] || null],
      floor: [this.select_address[5] || null],
      flat: [this.select_address[3] || null],
      use_bonus: [false],
      summa_bonus: [null],
      promocode: [null],      
      action: [null],
      isCall: [false],
      isComment: [false],
      comment: [null],
      summa: [this.sum_order],
      discount: ['null'],
      addres: [this.address || null]
    });
    this.getOrderDay();
    if (this.isCourier) this.setDefaultAddress();
  }

  loadBasket(): void {
    if(localStorage?.length > 0 && localStorage.getItem('basket')){
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    }
    this.getTotalPrice();
    this.getMinPrice();   
    this.getAction();
  }


  onSubmitAddress() {  
    this.fullAddress =  this.orderForm?.get('street')?.value + ', '+ this.orderForm?.get('house')?.value + ', '+ this.orderForm?.get('city')?.value;
    this.accountService.updateAddress(this.fullAddress);
    this.getZoneStatus();  
  }

  getZoneStatus():void {
    this.accountService.zoneStatus$.subscribe(status => {
      this.isInGreenZone = status.isGreenZone;
      this.isInYellowZone = status.isYellowZone;
      this. deliveryMethodClick(this.orderForm?.get('delivery_method')?.value);
    });
  }


  getMinPrice(): void {
    this.sum_order = this.total;
    this.sum_delivery = ((this.total >= 50 && this.isInYellowZone) || (this.total >= 40 && this.isInGreenZone)) ? 0 : ((this.total < 50 && this.isInYellowZone) ? 30 : (this.total < 40 && this.isInGreenZone) ? 20 : 0);  
    this.pizzaCount = this.basket.filter(el => el.category.path === 'pizza')?.reduce((count: number, el: IProductResponse) => count + el.count, 0);   
    let priceArr: Array<number> = [];
    if (this.pizzaCount > 0) {
      this.basket.filter(el => el.category.path === 'pizza').slice()
        .sort((a, b) => (a.price + a.addition_price) - (b.price + b.addition_price))
        .forEach(function (item) {
          for (let i = 0; i < item.count; i++) {
            priceArr.push(item.price + (item.addition_price ? item.addition_price : 0 ));
          }
        });
      // this.priceArr = priceArr;
      this.priceArr = priceArr.sort((a, b) => a - b);
      this.minPrice = Math.min(...priceArr);
    } else this.minPrice = 0;
      // Math.min(...priceArr);
    this.getOrderDay();    
    if ((this.pizzaCount % 3 == 2 && this.dayOfWeek >= 1 && this.dayOfWeek <= 4) || (this.pizzaCount % 4 == 3 && (this.dayOfWeek >= 5 || this.dayOfWeek == 0))) {
      this.pizzaAction();
    }
    const minPriceValue = priceArr[0] || 0;
    let arrMinPriceProduct : Array<IProductResponse>=[];
    arrMinPriceProduct = this.basket.filter((el) => el.category.path === 'pizza' && (el.price + (el.addition_price ? el.addition_price : 0)) === minPriceValue);
    this.minPriceProduct = arrMinPriceProduct[0];   
  }

  getTotalPrice(): void {    
    this.total = this.basket
    ?.reduce((total: number, prod: IProductResponse) => 
      total + prod.count * (prod.price + (Number(prod.addition_price) || 0)), 0);
    // this.total = this.basket
    //   ?.reduce((total: number, prod: IProductResponse) => total + prod.count * (prod.price + (Number(prod.price) + Number(prod.addition_price ? prod.addition_price : 0))), 0);
    this.count = this.basket
      ?.reduce((totalCount: number, prod: IProductResponse) => totalCount + prod.count, 0); 
    this.bonus = this.basket
      ?.reduce((bonus: number, prod: IProductResponse) => bonus + prod.bonus * prod.count, 0); 
  }

  loadUser(): void {
    if(localStorage.length > 0 && localStorage.getItem('currentUser')){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
      this.address = this.currentUser.address;
      this.sum_bonus = this.currentUser.bonus;      
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
          }
        }        
      })
      if (idAdd) {
        if (value) basket[index].count += 1;  
        if (!value && basket[index].count > 1)  basket[index].count -= 1;
      }
      else {        
        basket.push(product);
          }
    }
    else {     
      basket.push(product);       
    }
    localStorage.setItem('basket', JSON.stringify(basket));
    product.count = 1;
    this.orderService.changeBasket.next(true);   
    product = product;
  }


  removeFromBasket(product: IProductResponse): void{
    let basket: Array<IProductResponse> = [];
    if(localStorage?.length > 0 && localStorage.getItem('basket')){
      basket = JSON.parse(localStorage.getItem('basket') as string);
      if(basket.some(prod => prod.id === product.id)){
        const index = basket.findIndex(prod => prod.id === product.id);
        basket.splice(index,1);
      }
      localStorage.setItem('basket', JSON.stringify(basket));
      if (this.basket.filter(el => (el.category.path === 'pizza' && el.count > 2)).length > 0) {
        this.isPizzaCount = true;
      } else this.isPizzaCount = false;
      this.orderService.changeBasket.next(true);
    }
  }

  
  addOrder(): void {
    this.orderForm?.patchValue({
        summa: this.sum_order - this.sum_delivery,
        discount: this.minPrice
    });
    const products = JSON.parse(localStorage.getItem('basket') || '[]');
    if (this.currentUser) this.currentUser.bonus = this.bonus;
    const order = {
      ...this.orderForm?.value,
      total: this.sum_order,
      product: products       
    };
    if (!this.isInGreenZone && !this.isInYellowZone && this.orderForm?.get('delivery_method')?.value == 'courier') {
      this.dialog.open(AlertDialogComponent, {
        data: {
          icon: 'Sorry, your address is not in the delivery zone',
          message: `Please change your delivery address`
        }
    })
    } else {
    this.currentUser?.orders?.push(order);
    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    if (this.currentUser) {        
        this.orderService.createFirebase(order).then(() => {            
            const userRef = doc(this.afs, 'users', this.currentUser.uid);
            updateDoc(userRef, {
                orders: arrayUnion(order) 
            }).then(() => {                
                this.dialog.open(AlertDialogComponent, {
                    data: {
                      icon: 'Order completed successfully',
                      message: `Order #${this.currentNumOrder} will be delivered to the specified address`
                    }
                });
                this.toastr.showSuccess('', 'Order successfully created!');
                this.removeAllFromBasket();
                this.router.navigate(['/cabinet/history']);
            }).catch((error) => {
                console.error('Error updating user profile:', error);
                this.toastr.showError('Unable to update user profile.', 'Error');
            });
        }).catch((error) => {
            console.error('Error creating order in Firebase:', error);
            this.toastr.showError('Failed to create order.', 'Error');
        });
    }
  }
}

  removeAllFromBasket(): void {
    let basket: Array<IProductResponse> = [];
    basket = JSON.parse(localStorage.getItem('basket') as string);
    if(localStorage?.length > 0 && localStorage.getItem('basket')){
        basket.splice(0);
      }
    localStorage.setItem('basket', JSON.stringify(basket));
    this.orderService.changeBasket.next(true);
  }

  // additionDeleteClick(product: IProductResponse, additionName: any): void {
  //   if (localStorage?.length > 0 && localStorage.getItem('basket')) {
  //     let basket = JSON.parse(localStorage.getItem('basket') as string);
  
  //     // Find the index of the product in the basket array
  //     const productIndex = this.findProductIndexInBasket(product);
  
  //     if (productIndex !== -1) {
  //       for (let i = 0; i < basket.length; i++) {
  //         if (basket[i].id === product.id && this.areAdditionsEqual(basket[i].selected_addition, product.selected_addition)) {
  //           const additionPrice = Number(product.selected_addition.find(addition => addition.name === additionName)?.price);
  //           if (additionPrice !== undefined) {
  //             // Log the current addition price before subtraction
  //             console.log('Current addition_price:', basket[i].addition_price);
              
  //             basket[i].addition_price -= additionPrice;
  //             console.log('After subtraction:', basket[i].addition_price);
  
  //             const additionIndex = basket[i].selected_addition.findIndex((addition: { name: any; }) => addition.name === additionName);
  //             if (additionIndex !== -1) {
  //               basket[i].selected_addition.splice(additionIndex, 1);
  //             }
  //             if (!basket[i].selected_addition.length) basket[i].addition_price = 0;
  //             this.updateProductInBasket(basket[i], i);
  //             break;
  //           } else {
  //             console.error('Price for addition not found or invalid:', additionName);
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
  

  additionDeleteClick(product: IProductResponse, additionName: any): void {
    if(localStorage?.length > 0 && localStorage.getItem('basket')){
      let basket = JSON.parse(localStorage.getItem('basket') as string);
    
    // Find the index of the product in the basket array
    const productIndex = this.findProductIndexInBasket(product);
    
    if (productIndex !== -1) {      
        for (let i = 0; i < basket.length; i++) {           
            if (basket[i].id === product.id && this.areAdditionsEqual(basket[i].selected_addition, product.selected_addition)) {               
                basket[i].addition_price -= Number(product.selected_addition.find(addition => addition.name === additionName)?.price || 0) ;   
                console.log(basket[i].addition_price, 'addition_price')  ;           
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

  openLoginDialog(): void {
    this.dialog.open(AuthDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'auth-dialog',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      console.log(result);
    })
  }


  formatAddress(addr: any): string {
    return `${addr.city}/${addr.street}/${addr.house}/${addr.flat}/${addr.entrance}/${addr.floor}`;
  }
  

setDefaultAddress():void {
   let addr = this.address[0];    
      this.orderForm.patchValue({
        city: addr.city|| '',
        street: addr.street || '',
        house: addr.house || '',
        flat: addr.flat || '',
        entrance: addr.entrance || '',
        floor: addr.floor || ''    
  });
  this.defaultAddress = this.select_address[0] + ' ' + this.select_address[1] + ' ' + this.select_address[2] + ' ' + this.select_address[3] + '' 
  if (this.address && this.address.length > 0) {
    let addr = this.address[0]; 
    this.defaultAddress = `${addr.city} ${addr.street} ${addr.house} ${addr.flat}`;
    this.orderForm.patchValue({ addres: this.defaultAddress });
  }
}

  getAddress(): void {
    this.orderForm.patchValue({ addres: this.address });
    if (!this.currentUser) {
      this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: 'Please log in!',
        }
      });
      this.openLoginDialog();
    } else {
    let addr = this.address;
    
    this.select_address = this.formatAddress(addr[0]).split('/');
    this.orderForm.patchValue({
      assress: this.select_address,
      'city': this.select_address[0],
      'street': this.select_address[1],
      'house': this.select_address[2],
      'entrance': this.select_address[4] || '',
      'floor': this.select_address[5] || '',
      'flat': this.select_address[3] || ''      
    });  
  }
  }

  parseAddress(address: string): any[] {
    return address.split('/');
  }

  onAddressChange(event: any) {
    const selectedAddress = this.parseAddress(event.target.value);
    this.orderForm.patchValue({
      address: event.target.value,
      city: selectedAddress[0],
      street: selectedAddress[1],
      house: selectedAddress[2],
      flat: selectedAddress[3] || '',
      entrance: selectedAddress[4] || '',
      floor: selectedAddress[5] || ''
    });
    this.onSubmitAddress();
  }

  sumBonusClick(): void {
    let sumBonus = this.orderForm?.get('summa_bonus')?.value;
    if (sumBonus > this.sum_bonus) {
      this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: 'The sum of bonuses cannot exceed ' + this.sum_bonus + ' €',          
        }
      });
      this.orderForm.patchValue({ 'summa_bonus': this.sum_bonus });
    }
    
  }

  pizzaAction(): void {   
    this.actionCountDialog();            
    this.actionClick();   
  }

  bonusClick(): void{    
    if (!this.orderForm?.get('phone')?.value) {
        this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: 'Please enter a phone number ',
          icon: 'Error',
          isError: false
        }
        });
      this.isBonus = false;
    } else
      if (this.sum_bonus > 0) this.isBonus = true;
    this.isBonusClick = true;
  }

  getOrderDay(): void {
    let orderDate = new Date(this.orderForm?.get('delivery_date')?.value);
    if (!orderDate) {
      orderDate = new Date();
      this.orderForm.patchValue({ 'delivery_date': orderDate });
    } 
    this.dayOfWeek = orderDate.getDay();
    this.getAction();
  }

  getAction(): void {    
    if (this.pizzaCount > 2 && this.dayOfWeek >= 1 && this.dayOfWeek <= 4 ) {       
      this.countActionProduct = Math.floor(this.pizzaCount / 3);
      this.sum_order = this.total - this.minPrice * this.countActionProduct;     
      this.isPizzaCount = true;
      this.isPizzaCount2 = false;
      this.orderForm?.patchValue({
        'action' : '2+1'
      })
    } else
    if (this.pizzaCount > 3 && (this.dayOfWeek >= 5 || this.dayOfWeek == 0)) {       
      this.countActionProduct = Math.floor(this.pizzaCount / 4);      
      this.sum_order = this.total - this.minPrice * this.countActionProduct ;   
      this.isPizzaCount2 = true;
      this.isPizzaCount = false;
      this.orderForm?.patchValue({
        'action' : '3+1'
      })     
    } else {     
      this.sum_order = this.total;
      this.countActionProduct = 0;
      this.orderForm?.patchValue({
        'action' : null
      })
    }
  }

  actionClick(): void {    
    const actionValue = this.orderForm?.get('action')?.value;
    this.countActionProduct = 1;
    if (actionValue === 'localPickup') {
      this.sum_order = Math.round(this.total * 0.85);
      this.minPrice = Math.round(this.total * 0.15);
    } else if (actionValue === '2+1') {
      this.countActionProduct = Math.floor(this.pizzaCount / 3);
      this.minPrice = Math.min(...this.priceArr);
      this.sum_order = this.total - (this.minPrice * this.countActionProduct);
    } else if (actionValue === '3+1') {
      this.minPrice = Math.min(...this.priceArr);
      this.countActionProduct = Math.floor(this.pizzaCount / 4);
      this.sum_order = this.total - (this.minPrice * this.countActionProduct);
    } else {
      this.sum_order = this.total;
      this.minPrice = 0;
    }
  }

  bonusUse(): void {
    if (!this.orderForm?.get('summa_bonus')?.value) {
      this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: 'You have not entered the number of bonuses ',
          icon: 'Error',
          isError: false
        }
      });
    } else 
    if (this.orderForm?.get('summa_bonus')?.value <= this.sum_bonus && !this.isUseBonus) {
      this.sum_order = this.sum_order - this.orderForm?.get('summa_bonus')?.value;
      this.isUseBonus = true;
    }
  }

  deliveryMethodClick(delivery_method: string): void {
    if (delivery_method === 'local_pickup') {
      this.orderForm.patchValue({ 'action': 'localPickup' });      
      this.sum_delivery = 0;
      this.isCourier = false;
    } else {      
      this.orderForm.patchValue({ 'action': '' });       
      this.sum_delivery = ((this.total >= 50 && this.isInYellowZone) || (this.total >= 40 && this.isInGreenZone)) ? 0 : ((this.total < 50 && this.isInYellowZone) ? 30 : (this.total < 40 && this.isInGreenZone) ? 20 : 0);  
      this.isCourier = true;      
    }
    this.actionClick();
  }

  isWithoutRestClick(): void {
    if (this.orderForm?.get('isWithoutRest')?.value) {
      this.orderForm.patchValue({ 'cash': 0 });
    }
  }

  actionCountDialog(): void{       
      this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: (this.pizzaCount % 3 ==  2 && this.dayOfWeek >= 1 && this.dayOfWeek <= 4 ) ? 'When ordering any 3 pizzas, each 3 is free. Would you like to add pizza?' : 'When you order any 4 pizzas, each 4 is free. Want to add pizza?',
          icon: '',
          isError: true,
          btnOkText: 'Yes, add pizza',
          btnCancelText: 'No thanks'
        }
      }).afterClosed().subscribe(result => {
        console.log(result);   
        if (result) {                                
          if (this.minPriceProduct) this.addToBasket(this.minPriceProduct, true);                     
        }
      });
  }


  atTimeclick(): void {
    this.atTime = !this.atTime;
    this.orderForm.patchValue({ 'at_time': this.atTime });
  }
}