
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CategoryService } from '../../shared/services/category/category.service';
import { ICategoryResponse } from '../../shared/interfaces/category/category.interface';


describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let categoryService: CategoryService
  
  const categoryServiceStub = {
    getOneFirebase: (id: string) =>
      of({
        id: id,
        name: 'test category',
        path: '',
        imagePath: '',
      }),
      getAllFirebase: () =>
        of([{
          id: 1,
          name: 'test category',
          path: '',
          imagePath: '',
        }])
  };
  

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FooterComponent],
        imports: [RouterTestingModule],
        providers: [
          { provide:CategoryService, useValue: categoryServiceStub}
        ],
        
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it(`should return empty list of categories'`, () => {
    const category: ICategoryResponse = {
      id: 3,
      name: 'pizza',
      path: 'pizza',
      imagePath: ''
    };
    component.getCategories();
    categoryService?.getAllFirebase().subscribe((response: any) => expect(response).toBe(category));
    expect(component).toBeTruthy();
  });
});