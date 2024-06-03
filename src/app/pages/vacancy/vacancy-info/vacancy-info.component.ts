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
  public description!: string;
  //public currentVacancy: Array<IVacancyResponse> = [];

  public vacancy!: IVacancyResponse;
  eventSubscription: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private massageService: MassageService,
    private imageService: ImageService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private vacancyService: VacancyService
  ) { 
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        this.loadVacancy();
        this.loadMassages();
        this.activatedRoute.data.subscribe(response => {
          this.vacancy = response['vacancyInfo'];
        })
      }
    })
  }

  ngOnInit(): void {
    //console.log(this.vacancy?.description);
    console.log(this.getSanitizedDescription(this.vacancy?.description));
    this.initMassageForm();
    
  }

  initMassageForm(): void {
    this.massageForm = this.fb.group({
      name: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      description: [null],
      imagePath: [null],
      date_message: new Date()
    });
    this.isValid = false;
  }
  
  loadVacancy(): void {
    const VACANCY_ID = (this.activatedRoute.snapshot.paramMap.get('id') as string);
    this.accountService.VACANCY_ID = VACANCY_ID;
    this.vacancyService.getOneFirebase( VACANCY_ID).subscribe(data => {
      this.vacancy = data as IVacancyResponse;
      this.description = this.getSanitizedDescription(this.vacancy.description);
      console.log(this.description, 'descript')
      // console.log(this.currentNews.detail.detail[0].description)
      // this.descrip = this.sanitizer.bypassSecurityTrustHtml(this.currentNews.detail.detail[0].description);
      // console.log(this.descrip);
    });
  }

  loadMassages(): void {
    this.massageService.getAllFirebase().subscribe(data => {
      this.massages = data as IMassageResponse[];
    })
  }

  getSanitizedDescription(description: string): string {
    const config = { ALLOWED_TAGS: ['h2', 'strong', 'ul', 'li', 'b'] };
    const sanitized = DOMPurify.sanitize(description, config);
    console.log(sanitized); 
    return sanitized;
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

  addMassage(): void {
    this.isValid = true;
    if (this.massageForm.valid) {
      this.massageService.createFirebase(this.massageForm.value).then(() => {
        this.toastr.success('Massage successfully created');
      })
      this.massageForm.reset();
      this.isUploaded = false;
      this.uploadPercent = 0;
    }
  }

  /* getDescription(str:string):string {
   // return  str.split(/(✅ )/);
   str.replace(/(<)/gi, `&#60`);
    return str.replace(/(>)/gi, `&#62`);
   
 } */
    

}
