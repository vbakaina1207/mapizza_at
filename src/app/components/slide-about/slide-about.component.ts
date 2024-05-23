import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-slide-about',
  templateUrl: './slide-about.component.html',
  styleUrls: ['./slide-about.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SlideAboutComponent implements OnInit {
  public images = ['assets/benefits/benefits-1.svg', 'assets/benefits/benefits-2.svg', 'assets/benefits/benefits-3.svg', 'assets/benefits/benefits-4.svg']

  constructor() { }

  ngOnInit() {
  }

}
