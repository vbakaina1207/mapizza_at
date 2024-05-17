import { Component, OnDestroy, OnInit } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription} from 'rxjs';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { IOrderResponse } from '../../shared/interfaces/order/order.interface';
import { OrderService } from '../../shared/services/order/order.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { ITypeAdditionResponse } from '../../shared/interfaces/type-addition/type-addition.interfaces';
import { AuthDialogComponent } from '../../components/auth-dialog/auth-dialog.component';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy{
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
  public select_address = [];
  public sum_delivery = 0;
  public isPizzaCount = false;
  public pizzaCount: number = 0;
  public minPrice: number = 0;
  public freePizza: number = 0;
  public priceArr: Array<number> = [];
  public isBonusClick: boolean = false;
  public atTime: boolean = false;
  public isUseBonus: boolean = false;
  public isCourier: boolean = true;
  public dayOfWeek!: number;



  constructor(
    private orderService: OrderService,
    private fb: FormBuilder,
    private toastr: ToastService,
    private router: Router,
    private afs: Firestore,
    public dialog: MatDialog
    ) {
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        this.loadUser();
        this.getOrders();
        this.loadBasket();
        this.updateBasket();
        this.initOrderForm();    
      }
    })
  }

  ngOnInit(): void {
  
  }

  ngOnDestroy(): void{
    this.pizzaAction();
    this.getMinPrice();
  }
  

  getOrders(): void {
    this.orderService.getAllFirebase().subscribe((data) => {
      this.order = data as IOrderResponse[];
      /* if (this.order[0]?.order_number === undefined || this.order[0]?.order_number === null) {
        this.order[0].order_number = 1;
      } else this.order[0].order_number += 1; */
     /*  if (!this.order[0]?.order_number) {
        this.order[0].order_number = 1;
      } else {
        this.order[0].order_number += 1;
      }
      this.currentNumOrder = this.order[0]?.order_number;
      this.currentOrder = this.order[0]?.id ;
      this.orderForm.patchValue({ 'order_number': this.order[0]?.order_number });   */
      /* if (this.order && this.order.length > 0) {
        this.order[0].order_number = 1;
      } else
        this.order[0].order_number += 1;
        this.currentNumOrder = this.order[0]?.order_number;
        this.currentOrder = this.order[0]?.id;
        this.orderForm.patchValue({ 'order_number': this.order[0]?.order_number }); */

        if (this.order && this.order.length > 0) {
          if (!this.order[0]?.order_number) {
            this.order[0].order_number = 1; 
          } else {
            this.order[0].order_number += 1;
          }
          this.currentNumOrder = this.order[0]?.order_number;
          this.currentOrder = this.order[0]?.id;
          this.orderForm.patchValue({ 'order_number': this.order[0]?.order_number });
        } 
    })

    //const dayOfWeek = this.getOrderDayOfWeek(orderDate);

    
    
    
  }


  initOrderForm(): void {
    this.getOrders();
    this.orderForm = this.fb.group({
      order_number: this.currentNumOrder || 1,
      uid: this.currentUser?.uid || null,
      date_order: new Date(),
      status: false,
      total: this.total,
      product: [this.basket],
      name: [this.currentUser['firstName'] || null, Validators.required],
      phone: [this.currentUser['phoneNumber'] || null, Validators.required],
      email: [this.currentUser['email'] || null, Validators.required], 
      delivery_method: ['courier', Validators.required],
      payment_method: ['cod', Validators.required],
      cash: [null],
      isWithoutRest: [true],
      at_time: [false],
      delivery_date: [null],
      delivery_time: [null],
      self_delivery_address: [null],
      city: [this.select_address[0] || null],
      street: [this.select_address[1] || null],
      house: [this.select_address[2] || null],
      entrance: [null],
      floor: [null],
      flat: [null],
      use_bonus: [false],
      summa_bonus: [null],
      promocode: [null],
      action: [this.isPizzaCount ? '2+1' : null],
      isCall: [false],
      isComment: [false],
      comment: [null],
      'summa': this.sum_order,
      'discount':'null',
      addres: [this.address || null]
    });
  
  }

  loadBasket(): void {
    if(localStorage?.length > 0 && localStorage.getItem('basket')){
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    }
    this.getTotalPrice();
    this.getMinPrice();
  }

  getMinPrice(): void {
    this.sum_order = this.total;
    this.sum_delivery = (this.total >= 500) ? 0 : 100;
    this.pizzaCount = this.basket.filter(el => el.category.path === 'pizza')?.reduce((count: number, el: IProductResponse) => count + el.count, 0);
    this.freePizza = Math.floor(this.pizzaCount / 3);
    let priceArr: Array<number> = [];
    this.basket.filter(el => el.category.path === 'pizza').slice()
      .sort((a, b) => (a.price + a.addition_price) - (b.price + b.addition_price))
      .forEach(function (item) {      
      for (let i = 0; i < item.count; i++){
        priceArr.push(item.price + item.addition_price);
      }        
    });
    this.minPrice = priceArr.slice(0, this.freePizza).reduce((a, b) => a + b, 0);
    if (this.pizzaCount > 2 || this.pizzaCount % 3 == 2) {
      this.pizzaAction();
      if (this.pizzaCount > 2) {
        this.isPizzaCount = true;
        this.orderForm?.patchValue({ 'action': '2+1' });
      }
      
    }
  }

  getTotalPrice(): void {
    this.total = this.basket
      ?.reduce((total: number, prod: IProductResponse) => total + prod.count * (prod.price + prod.addition_price), 0);
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
    this.orderForm.patchValue({
      'summa': this.sum_order,
      'discount': this.minPrice
    });
    let bonus = { bonus: this.bonus };
    setDoc(doc(this.afs, 'users', this.currentUser.uid), bonus, { merge: true });
    localStorage.setItem('currentUser', JSON.stringify( bonus));
    if (this.currentUser /*&& this.total >= 300*/) {      
      this.orderService.createFirebase(this.orderForm.value).then(() => {
        this.toastr.showSuccess('', 'Замовлення успішно створено');
      });
      this.removeAllFromBasket();
      this.router.navigate(['/cabinet/history']);
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

  additionDeleteClick(product: IProductResponse, additionName: any): void {
    for (let i = 0; i < product.selected_addition.length; i++) {
      if (product.selected_addition[i].name == additionName) {
        product.addition_price = product.addition_price - Number(product.selected_addition[i].price);
        product.selected_addition.splice(i, 1);
      }
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

  getAddress(): void {
    if (!this.currentUser) {
      this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: 'Авторизуйтесь, будь ласка!',
        }
      });
      this.openLoginDialog();
    } else {
    let addr = this.orderForm.get('addres')?.value;    
    this.select_address = addr?.toString().split("/");
    this.select_address = this.select_address.filter(el => el != 'null')
    this.orderForm.patchValue({
      'city': this.select_address[0],
      'street': this.select_address[1],
      'house': this.select_address[2]
    });
  }
  }

  sumBonusClick(): void {
    let sumBonus = this.orderForm.get('summa_bonus')?.value;
    if (sumBonus > this.sum_bonus) {
      this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: 'Сума бонусів не може перевищувати ' + this.sum_bonus + ' грн',
        }
      });
      this.orderForm.patchValue({ 'summa_bonus': this.sum_bonus });
    }
    
  }

  pizzaAction(): void {    
    if (this.pizzaCount % 3 ==  2) {
      this.actionCountDialog();
      }
    if (this.pizzaCount > 2) {
      this.isPizzaCount = true;
      this.actionClick();
    }
  }

  bonusClick(): void{    
    if (!this.orderForm.get('phone')?.value) {
        this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: 'Будь ласка введіть номер телефону ',
          icon: 'Помилка',
          isError: false
        }
        });
      this.isBonus = false;
    } else
      if (this.sum_bonus > 0) this.isBonus = true;
    this.isBonusClick = true;
  }

  // sumThree() {
  //           return this.basket.filter(el => el.category.path === 'pizza').slice().sort((a, b) => a - b).slice(0, ).reduce((a, b) => a + b);
  //       }


  /* getOrderDay(): void {
    let orderDate = this.orderForm?.get('delivery_date')?.value;
    if (!orderDate) 
      orderDate = new Date();
    this.dayOfWeek  = orderDate.getDay();
    console.log(this.dayOfWeek);
  }
   */

  getOrderDay(): void {
    let orderDate = new Date(this.orderForm?.get('delivery_date')?.value);
    if (!orderDate) 
      orderDate = new Date();
    this.dayOfWeek = orderDate.getDay();
    console.log(this.dayOfWeek);
  }
  
  actionClick(): void {
    if (this.orderForm?.get('action')?.value === 'localPickup') {
      this.sum_order = Math.round(this.total * 0.85);    
    } 
    this.getOrderDay();
    if (this.pizzaCount > 2 || this.orderForm?.get('action')?.value === '2+1') {       
        this.sum_order = this.total - this.minPrice;    
    } 
    if (this.orderForm?.get('action')?.value === '-1') {
        this.sum_order = this.total;
    }
  }

  bonusUse(): void {
    if (!this.orderForm.get('summa_bonus')?.value) {
      this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: 'You have not entered the number of bonuses ',
          icon: 'Помилка',
          isError: false
        }
      });
    } else 
    if (this.orderForm.get('summa_bonus')?.value <= this.sum_bonus && !this.isUseBonus) {
      this.sum_order = this.sum_order - this.orderForm.get('summa_bonus')?.value;
      this.isUseBonus = true;
    }
  }

  deliveryMethodClick(delivery_method: string): void {
    if (delivery_method === 'local_pickup') {
      this.orderForm.patchValue({ 'action': 'localPickup' });      
      this.sum_delivery = 0;
      this.isCourier = false;
    } else {
      console.log(delivery_method, "delivery")
      this.orderForm.patchValue({ 'action': '' });
      this.sum_delivery = (this.total >= 500) ? 100 : 0;    
      this.isCourier = true;
    }
    this.actionClick();
  }

  isWithoutRestClick(): void {
    if (this.orderForm.get('isWithoutRest')?.value) {
      this.orderForm.patchValue({ 'cash': 0 });
    }
  }

  actionCountDialog(): void{   
      this.dialog.open(AlertDialogComponent, {
        backdropClass: 'dialog-back',
        panelClass: 'alert-dialog',
        autoFocus: false,
        data: {
          message: 'When ordering any 3 pizzas, each 3 is free. Want to add pizza?',
          icon: '',
          isError: true
        }
      }).afterClosed().subscribe(result => {
        console.log(result);    
      });
  }


  atTimeclick(): void {
    this.atTime = !this.atTime;
    this.orderForm.patchValue({ 'at_time': this.atTime });
  }
}
