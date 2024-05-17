import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CarouselComponent implements OnInit {
   public images = ['assets/banners/banner1.webp', 'assets/banners/banner2.webp', 'assets/banners/banner3.webp', 'assets/banners/dostavka-moped.webp']

  constructor() { }

  ngOnInit() {
    
  }

	
}

