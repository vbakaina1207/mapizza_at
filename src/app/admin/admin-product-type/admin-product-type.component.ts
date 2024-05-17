import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITypeProductResponse } from '../../shared/interfaces/type-product/type-product.interface';
import { TypeProductService } from '../../shared/services/type-product/type-product.service';
import { ImageService } from '../../shared/services/image/image.service';
import { AlertDialogComponent } from '../../components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-admin-product-type',
  templateUrl: './admin-product-type.component.html',
  styleUrls: ['./admin-product-type.component.scss']
})
export class AdminProductTypeComponent implements OnInit {

  public adminTypeProducts: Array<ITypeProductResponse> = [];
  public typeProductForm!: FormGroup;
  public isAdd = false;
  public editStatus = false;
  private currentTypeProductId!: string;
  public uploadPercent!: number;
  public isUploaded = false;


  constructor(
    private fb: FormBuilder,
    private typeProductService: TypeProductService,
    private imageService: ImageService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initTypeProductForm();
    this.loadTypeProducts();
  }

  initTypeProductForm(): void {
    this.typeProductForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      imgPath: [null, Validators.required]
    });
  }

  loadTypeProducts(): void {
    this.typeProductService.getAllFirebase().subscribe(data => {
      this.adminTypeProducts = data as ITypeProductResponse[];
    })
  }

  openForm():void {
    this.isAdd = true;
  }

  addTypeProduct(): void {
    if(this.editStatus){
      this.typeProductService.updateFirebase(this.typeProductForm.value, this.currentTypeProductId).then(() => {
        this.loadTypeProducts();
        this.toastr.success('Type of product successfully updated');
      })
    } else {
      this.typeProductService.createFirebase(this.typeProductForm.value).then(() => {
        this.toastr.success('Type of product  successfully created');
      })
    }
    this.editStatus = false;
    this.typeProductForm.reset();
    this.isAdd = false;
    this.isUploaded = false;
    this.uploadPercent = 0;
  }

  editTypeProduct(typeProduct: ITypeProductResponse): void {
    this.openForm();
    this.typeProductForm.patchValue({
      name: typeProduct.name,
      path: typeProduct.path,
      imgPath: typeProduct.imgPath
    });
    this.editStatus = true;
    this.currentTypeProductId = typeProduct.id as string;
    this.isUploaded = true;
  }

  deleteTypeProduct(typeProduct: ITypeProductResponse): void {
    this.dialog.open(AlertDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'alert-dialog',
      autoFocus: false,
      data: {
        message: 'Are you sure you want to remove the product type?',
        icon: '',
        isError: true
      }
    }).afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.typeProductService.deleteFirebase(typeProduct.id as string).then(() => {
          this.loadTypeProducts();
          this.toastr.success('Type of product  successfully deleted');
        })
      }
    })
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images', file.name, file)
      .then(data => {
        this.typeProductForm.patchValue({
          imgPath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }


  deleteImage(): void {    
    console.log('deleted');
    this.imageService.deleteUploadFile(this.valueByControl('imgPath')).then(() => {
      console.log('File deleted');
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.typeProductForm.patchValue({
        imagePath: null
      })
    }).catch(err => {
      console.log(err);
    })
  }

  valueByControl(control: string): string {
    return this.typeProductForm.get(control)?.value;
  }


}
