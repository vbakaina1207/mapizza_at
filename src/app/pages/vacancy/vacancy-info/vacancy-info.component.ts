import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IMassageResponse } from '../../../shared/interfaces/massage/massage.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IVacancyResponse } from '../../../shared/interfaces/vacancy/vacancy.interface';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MassageService } from '../../../shared/services/massage/massage.service';
import { ImageService } from '../../../shared/services/image/image.service';
import { ToastrService } from 'ngx-toastr';
import { VacancyService } from '../../../shared/services/vacancy/vacancy.service';
import { AccountService } from '../../../shared/services/account/account.service';
import DOMPurify from 'dompurify';
import { Timestamp } from '@angular/fire/firestore';
import { AlertDialogComponent } from '../../../components/alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-vacancy-info',
  templateUrl: './vacancy-info.component.html',
  styleUrl: './vacancy-info.component.scss',
  //encapsulation: ViewEncapsulation.None,
})
export class VacancyInfoComponent implements OnInit {

  public massages: Array<IMassageResponse> = [];
  public massageForm!: FormGroup;
  public uploadPercent!: number;
  public isUploaded = false;
  public file!: any;
  public inputEmpty = false;
  public isValid = false;
  public caption = '';
  public phone = '';
  public email = '';
  public workTime = '';
  public mailto = '';
  public placeholderDescription = '';
  public isAbout = false;
  public isSocial = false; 
  public vacancy!: IVacancyResponse;
  eventSubscription: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private massageService: MassageService,
    private imageService: ImageService,
    private toastr: ToastrService,
    private router: Router,
    public dialog: MatDialog
  ) { 
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {        
        this.loadMassages();
        this.activatedRoute.data.subscribe(response => {
          this.vacancy = response['vacancyInfo'];
        })
      }
    })
  }

  ngOnInit(): void {   
    this.initMassageForm();
    
  }

  initMassageForm(): void {
    this.massageForm = this.fb.group({
      name: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      description: [null],
      imagePath: [null],
      date_message: Timestamp.fromDate(new Date())
    });
    this.isValid = false;
  }
 

  loadMassages(): void {
    this.massageService.getAllFirebase().subscribe(data => {
      this.massages = data as IMassageResponse[];
    })
  }

  upload(event: any): void {
    this.file = event.target.files[0];
    this.imageService.uploadFile('images', this.file.name, this.file)
      .then(data => {
        this.massageForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
    console.log(this.isUploaded, this.file);
  }

  deleteImage(): void {
    this.imageService.deleteUploadFile(this.valueByControl('imagePath')).then(() => {
      console.log('File deleted');
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.massageForm.patchValue({
        imagePath: null
      })
    })
    this.file = null;
  }

  valueByControl(control: string): string {
    return this.massageForm.get(control)?.value;
  }

  // addMassage(): void {
  //   this.isValid = true;
  //   if (this.massageForm.valid) {
  //     this.massageService.createFirebase(this.massageForm.value).then(() => {
  //       this.toastr.success('Massage successfully created');
  //     })
  //     this.massageForm.reset();
  //     this.isUploaded = false;
  //     this.uploadPercent = 0;
  //   }
  // }

  
  addMassage(): void {
    this.isValid = true;
    Object.keys(this.massageForm.controls).forEach(field => {
      const control = this.massageForm.get(field);
      if (control && control.invalid) {
        control.markAsTouched({ onlySelf: true });
      }
    });
    if (this.massageForm.valid) {
      this.massageService.createFirebase(this.massageForm.value).then(() => {
        this.dialog.open(AlertDialogComponent, {
          backdropClass: 'dialog-back',
          panelClass: 'alert-dialog',
          autoFocus: false,
          data: {
            message: 'Massage successfully created ',
            icon: '',
            isError: false
          }
        });
        this.toastr.success('Massage successfully created');
        this.isValid = false;
      })
      this.massageForm.reset();
      this.isUploaded = false;
      this.uploadPercent = 0;
    }
  }

}
