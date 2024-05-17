import { Component, OnInit } from '@angular/core';
import { ICategoryResponse } from '../../shared/interfaces/category/category.interface';
import { CategoryService } from '../../shared/services/category/category.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  public userCategories: Array<ICategoryResponse> = [];

  constructor(
    private categoryService: CategoryService,
  ) { }

  ngOnInit() {
    this.getCategories();
  }


  getCategories(): void {
    this.categoryService.getAllFirebase().subscribe(data => {
      this.userCategories = data as ICategoryResponse[];
    })
  }

}
