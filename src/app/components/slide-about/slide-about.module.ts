import { NgModule } from "@angular/core";
import { SlideAboutComponent } from "./slide-about.component";
import { CommonModule } from "@angular/common";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [
    SlideAboutComponent
  ],
  exports:[
    SlideAboutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgbCarouselModule
  ]
})
export class SlideAboutModule { }