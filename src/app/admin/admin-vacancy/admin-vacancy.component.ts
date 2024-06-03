import { Component, OnInit } from '@angular/core';
import { IVacancyResponse } from '../../shared/interfaces/vacancy/vacancy.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VacancyService } from '../../shared/services/vacancy/vacancy.service';
import { ImageService } from '../../shared/services/image/image.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-vacancy',
  templateUrl: './admin-vacancy.component.html',
  styleUrl: './admin-vacancy.component.scss'
})
export class AdminVacancyComponent implements OnInit{

  public adminVacancy: Array<IVacancyResponse> = [];
  public vacancyForm!: FormGroup;
  public isAdd = false;
  public editStatus = false;
  public uploadPercent!: number;
  public isUploaded = false;
  private currentVacancyId!: number | string;

  constructor(private fb: FormBuilder,
    private vacancyService: VacancyService,
    private imageService: ImageService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.initVacancyForm();
    this.loadVacancy();
  }

  initVacancyForm(): void {    
    this.vacancyForm = this.fb.group({
      name: [null, Validators.required],
      path: [null, Validators.required],
      description: [null, Validators.required],
      imagePath: [null, Validators.required]
    });
  }

  loadVacancy(): void {
    this.vacancyService.getAllFirebase().subscribe(data => {
      this.adminVacancy = data as IVacancyResponse[];
    })
  }

  addVacancy(): void {
    if(this.editStatus){
      this.vacancyService.updateFirebase(this.vacancyForm.value, this.currentVacancyId as string).then(() => {
        this.loadVacancy();
        this.toastr.success('Vacancy successfully updated');
      })
    } else {
      this.vacancyService.createFirebase(this.vacancyForm.value).then(() => {
        this.toastr.success('Vacancy successfully created');
      })
    }
    this.editStatus = false;
    this.vacancyForm.reset();
    this.isUploaded = false;
    this.uploadPercent = 0;
    this.isAdd = false;
  }

  editDiscount(vacancy: IVacancyResponse): void {
    this.openForm();
    this.vacancyForm.patchValue({
      name:vacancy.name,
      path: vacancy.path,
      description: vacancy.description,
      imagePath: vacancy.imagePath
    });
    this.editStatus = true;
    this.currentVacancyId = vacancy.id;
    this.isUploaded = true;
  }

  deleteDiscount(vacancy: IVacancyResponse): void {
    this.vacancyService.deleteFirebase(vacancy.id as string).then(() => {
      this.loadVacancy();
      this.toastr.success('Vacancy successfully deleted');
    })
  }

  upload(event: any): void {
    const file = event.target.files[0];
    this.imageService.uploadFile('images', file.name, file)
      .then(data => {
        this.vacancyForm.patchValue({
          imagePath: data
        });
        this.isUploaded = true;
      })
      .catch(err => {
        console.log(err);
      })
  }


  deleteImage(): void {
    this.imageService.deleteUploadFile(this.valueByControl('imagePath')).then(() => {
      console.log('File deleted');
      this.isUploaded = false;
      this.uploadPercent = 0;
      this.vacancyForm.patchValue({
        imagePath: null
      })
    })
      .catch(err => {
        console.log(err);
      })
  }

  valueByControl(control: string): string {
    return this.vacancyForm.get(control)?.value;
  }


  openForm():void {
    this.isAdd = true;
  }

}


