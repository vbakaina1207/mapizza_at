import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IOrderResponse } from '../../shared/interfaces/order/order.interface';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../shared/services/order/order.service';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit {
  public userOrders: Array<IOrderResponse> = [];
  public products: Array<IProductResponse> | any = [];
  private eventSubscription!: Subscription;
  public orderForm!: FormGroup;
  private currentOrderId!: number | string;
  public isEdit: boolean = false;


  constructor(
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastService
  ) {
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        this.getOrders();
      }
    })
  }

  ngOnInit() {
    this.initOrderForm();
  }

  getOrders(): void {
    this.orderService.getAllFirebase().subscribe(data => {
      this.userOrders = data as IOrderResponse[];
    })
  }

  initOrderForm(): void {
    this.orderForm = this.fb.group({
      status: [null, Validators.required],
    });
  }

  changeOrder(order: IOrderResponse): void {
    this.isEdit = !this.isEdit;
    this.orderForm.patchValue({
      'status': this.isEdit
    });
    
    this.currentOrderId = order.id;
    this.orderService.updateFirebase(this.orderForm.value, this.currentOrderId as string).then(() => {
      this.getOrders();
      this.toastr.showSuccess('', 'Order successfully updated');
    })
  }

}
