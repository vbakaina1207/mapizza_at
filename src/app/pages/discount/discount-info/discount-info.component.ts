import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IDiscountResponse } from '../../../shared/interfaces/discount/discount.interface';
import { DiscountService } from '../../../shared/services/discount/discount.service';

@Component({
  selector: 'app-discount-info',
  templateUrl: './discount-info.component.html',
  styleUrls: ['./discount-info.component.scss']
})
export class DiscountInfoComponent implements OnInit {

  public discount!: IDiscountResponse;
  public description: Array<string> = [];
  
  constructor(
    private discountService: DiscountService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.discount = response['discountInfo'];
      this.description = this.getDescription(this.discount.description);
      this.description = this.description.splice(0, this.description.length );
    })
  }


getDescription(str:string):Array<string> {
  //return  str.split(/(✅ )/);
  return str.replace(/(✅)/gi, "<br>✅").replace(/❌/gi,"<br>❌").split("<br>");
  // return str.split("<br>");
}


}
