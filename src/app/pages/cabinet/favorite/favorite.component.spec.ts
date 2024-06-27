/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteComponent } from './favorite.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { IProductResponse } from '../../../shared/interfaces/product/product.interface';
import { ITypeAdditionResponse } from '../../../shared/interfaces/type-addition/type-addition.interfaces';


describe('FavoriteComponent', () => {
  let component: FavoriteComponent;
  let fixture: ComponentFixture<FavoriteComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser = {
    username: 'testuser',
    favorite: [
      {
        id: '1',
      category: { id: 1, name: 'nameCategory', path: '', imagePath: '' },
      type_product: { id: 1, name: 'nameTypeProduct', path: '', imgPath: '' },
      type_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      selected_addition: [{ id: 1, name: 'type', path: '', description: '', weight: '25', price: 25, imagePath: '', isSauce: false }] as ITypeAdditionResponse[],
      name: 'Product Name', path: '', ingredients: 'products', weight: '', price: 12, addition_price: 0, bonus: 0, imagePath: '', count: 1
      }
    ] as Array<IProductResponse>
  };


  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [FavoriteComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteComponent);
    component = fixture.componentInstance;
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return key === 'currentUser' ? JSON.stringify(mockUser) : null;
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('load user', () => {
    component.loadUser();
    expect(component.currentUser).toEqual(mockUser);
    expect(component.favoriteProducts).toEqual(mockUser.favorite);
  });

});