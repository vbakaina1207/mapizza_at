import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IDiscountResponse } from '../../shared/interfaces/discount/discount.interface';
import { DiscountService } from '../../shared/services/discount/discount.service';


@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.scss']
})
export class DiscountComponent implements OnInit {
  public userDiscounts: Array<IDiscountResponse> = [];
  public eventSubscription!: Subscription;

  constructor(
    private discountService: DiscountService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        this.getDiscounts();
      }
    })
  }

  ngOnInit(): void {

  }

  getDiscounts(): void {
    this.discountService.getAllFirebase().subscribe(data => {
      this.userDiscounts = data as IDiscountResponse[];
    })
  }


  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
