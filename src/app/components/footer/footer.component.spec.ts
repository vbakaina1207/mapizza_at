
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { CategoryService } from '../../shared/services/category/category.service';
import { ICategoryResponse } from '../../shared/interfaces/category/category.interface';
import { Component } from '@angular/core';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { SharedModule } from '../../shared/shared.module';


@Component({
  selector: 'app-blank',
  template: '<p>Blank Component</p>'
})
class BlankComponent {}

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'test', component: BlankComponent }
];


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
        imports: [
          RouterModule.forRoot( routes ),   
          SharedModule,
          AngularFireModule.initializeApp(environment.firebase),       
          provideFirebaseApp(() => initializeApp(environment.firebase)),
          provideFirestore(() => getFirestore())  
        ],
        providers: [
          { provide:CategoryService, useValue: categoryServiceStub},
          provideRouter(routes)
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