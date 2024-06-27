import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICategoryResponse } from '../../shared/interfaces/category/category.interface';
import { IProductResponse } from '../../shared/interfaces/product/product.interface';
import { IAdditionResponse } from '../../shared/interfaces/addition/addition.interfaces';
import { ITypeProductResponse } from '../../shared/interfaces/type-product/type-product.interface';
import { CategoryService } from '../../shared/services/category/category.service';
import { ProductService } from '../../shared/services/product/product.service';
import { AdditionProductService } from '../../shared/services/addition-product/addition-product.service';
import { TypeProductService } from '../../shared/services/type-product/type-product.service';
import { ImageService } from '../../shared/services/image/image.service';
import { ToastService } from '../../shared/services/toast/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';


@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {

  public adminCategories: Array<ICategoryResponse> = [];
  public adminProducts: Array<IProductResponse> = [];
  public adminTypeProducts: Array<ITypeProductResponse> = [];
  public adminAdditionProducts: Array<IAdditionResponse> = [];
  public productForm!: FormGroup;
  public editStatus = false;
  public uploadPercent = 0;
  public isUploaded = false;
  public isOpen = false;

  public currentCategoryId!: number | string;
  public currentCategoryName = '';
  public currentProductId!: string | number;

  

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private additionService: AdditionProductService,
    private typeProductService: TypeProductService,
    private imageService: ImageService,
    private toastr: ToastService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initProductForm();
    this.loadCategories();
    this.loadProduct();
    this.loadTypeProduct();
    this.loadAdditionProduct();
  }

  initProductForm(): void {
    this.productForm = this.fb.group({
      category: [null, Validators.required],
      type_product: [null],    
      type_addition: [[null]],
      selected_addition: [[null]],
      name: [null, Validators.required],
      path: [null, Validators.required],
      ingredients: [null],
      weight: [null, Validators.required],
      price: [null, Validators.required],
      bonus: [null, Validators.required],
      imagePath: [null, Validators.required],
      count: [1]
    });
  }

  loadCategories(): void {
    this.categoryService.getAllFirebase().subscribe(data => {
      this.adminCategories = data as ICategoryResponse[];
      this.productForm.patchValue({
        category: this.adminCategories[0]?.id
      })
    })
  }

  loadProduct(): void {
    this.productService.getAllFirebase().subscribe(data => {
      this.adminProducts = data as IProductResponse[];
    })
  }

  loadTypeProduct(): void {
    this.typeProductService.getAllFirebase().subscribe(data =>{
      this.adminTypeProducts = data as ITypeProductResponse[];
      this.productForm.patchValue({
        type_product: this.adminTypeProducts[0]?.id
      })
    })
  }

  loadAdditionProduct(): void {
    this.additionService.getAllFirebase().subscribe(data =>{
      this.adminAdditionProducts = data as IAdditionResponse[];
      this.productForm.patchValue({
        type_addition: this.adminAdditionProducts[0]?.id
      })
    })
  }

  addProduct(): void {
    if(this.editStatus){
      this.productService.updateFirebase(this.productForm.value, this.currentProductId as string).then(() => {
        this.loadProduct();
        this.toastr.showSuccess('','Product successfully updated');       
      })
    } else {
      this.productService.createFirebase(this.productForm.value).then(() => {
        this.toastr.showSuccess('', 'Product added');
      })
    }
    this.isOpen = false;
    this.editStatus = false;
    this.productForm.reset();
    this.uploadPercent = 0;
    this.isUploaded = false;
  }

  editProduct(product: IProductResponse): void {
    this.openForm();
    this.currentCategoryId = product.category.id;
    this.currentCategoryName = product.category.name;
    this.productForm.patchValue({
      category: product.category,
      type_product: product.type_product,      
      type_addition: product.type_addition,
      selected_addition: product.selected_addition,
      name: product.name,
      path: product.path,
      ingredients: product.ingredients,
      weight: product.weight,
      price: product.price,
      addition_price: product.addition_price,
      bonus: product.bonus,
      imagePath: product.imagePath,
      count: 1
    });
    this.isUploaded = true;
    this.editStatus = true;
    this.currentProductId = product.id;
  }

  deleteProduct(product: IProductResponse): void {
    this.dialog.open(AlertDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'alert-dialog',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to remove the product?',
        icon: '',
        isError: true
      }
    }).afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.productService.deleteFirebase(product.id as string).then(() => {
          this.loadProduct();
          this.toastr.showSuccess('', 'Product removed');
        })
      }
    })
  }




  openForm():void {
    this.isOpen = true;
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images', file.name, file)
      .then(data => {
        this.productForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }

  deleteImage(): void {
    this.imageService.deleteUploadFile(this.valueByControl('imagePath'))
      .then(() => {
        this.isUploaded = false;
        this.uploadPercent = 0;
        this.productForm.patchValue({ imagePath: null });
      })
      .catch(err => {
        console.log(err);
      })
  }

  valueByControl(control: any): any {
    return this.productForm.get(control)?.value;
  }


}
