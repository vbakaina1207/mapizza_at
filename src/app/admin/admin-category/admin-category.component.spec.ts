/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCategoryComponent } from './admin-category.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Storage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryService } from '../../shared/services/category/category.service';
import { ICategoryRequest, ICategoryResponse } from '../../shared/interfaces/category/category.interface';

describe('AdminCategoryComponent', () => {
  let component: AdminCategoryComponent;
  let fixture: ComponentFixture<AdminCategoryComponent>;
  let categoryService: CategoryService;

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
        }]),
        createFirebase: (data: ICategoryRequest) => Promise.resolve({
          id: '5',
          ...data
        } as ICategoryResponse),
        updateFirebase: (data: ICategoryRequest, id: string) => Promise.resolve({
          id: id,
          ...data
        } as ICategoryResponse),
        deleteFirebase: (id: string) => Promise.resolve()
  };

  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminCategoryComponent],
      imports: [
        ReactiveFormsModule, 
        HttpClientTestingModule, 
        // MatDialogModule
      ],
      providers: [
        { provide: Storage, useValue: {} },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: CategoryService, useValue: categoryServiceStub },
        // MatDialog
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should return empty list of categories'`, () => {
    const fixture = TestBed.createComponent(AdminCategoryComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(CategoryService);
    spyOn(service,"getAllFirebase").and.callFake(() => {
      return of([]);
    });
    app.loadCategories();
    expect(app.adminCategories).toEqual([]);
  });


  it('sending form values category', () => {
    spyOn(component, 'editCategory').and.callThrough();
    component.editCategory({
      id: 3,
      name: 'test category',
      path: '',
      imagePath: '',
    });
    expect(component.editCategory).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  it(`should return list of categories'`, () => {
    const fixture = TestBed.createComponent(AdminCategoryComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(CategoryService);
    spyOn(service,"getAllFirebase").and.callFake (() => {
      return of([
        { id: 1,
          name: 'set',
          path: 'set',
          imagePath: ''
        },
        { id: 2,
          name: 'rol',
          path: 'rol',
          imagePath: ''
        }
      ])
    });
    app.loadCategories();
    expect(app.adminCategories.length).toEqual(2);
  });

  it('should send add new category', async () => {
    
    const categoryRequest: ICategoryRequest = {
      name: 'set',
      path: 'set',
      imagePath: ''
    };

    const expectedCategory: ICategoryResponse = {
      id: '5',
      name: 'set',
      path: 'set',
      imagePath: ''
    };
    
    let editStatus = true;
    component.editStatus = editStatus;
    component.addCategory();
    if (editStatus) {
      await categoryService?.createFirebase(categoryRequest).then((result: any) => {
        expect(result.data()).toEqual(expectedCategory);
      });
    }
    editStatus = false;
    component.addCategory();
    if (!editStatus) {
      await categoryService?.updateFirebase(categoryRequest, '5').then((result: any) => {        
        expect(result.data()).toEqual(expectedCategory);
      });
    }
    expect(component).toBeTruthy();
  });
  

  it('delete values category', async () => {    
    spyOn(component, 'deleteCategory').and.callThrough();
    const categoryToDelete = {
      id: '2',
      name: 'set',
      path: 'set',
      imagePath: ''
    };
   
    component.deleteCategory(categoryToDelete);

    await categoryService?.deleteFirebase('2').then((result: any) => {
      expect(result).toBeUndefined();
    });
    expect(component).toBeTruthy();
  });

});