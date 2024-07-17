import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMassageResponse } from '../../shared/interfaces/massage/massage.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MassageService } from '../../shared/services/massage/massage.service';
import { NavigationEnd, Router } from '@angular/router';
import { ToastService } from '../../shared/services/toast/toast.service';

@Component({
  selector: 'app-admin-message',
  templateUrl: './admin-message.component.html',
  styleUrl: './admin-message.component.scss'
})
export class AdminMessageComponent implements OnInit, OnDestroy {

  public messageForm!: FormGroup;
  public currentDiscountId!: number | string;
  public messages: Array<IMassageResponse> | any = [];
  private eventSubscription!: Subscription;
  private currentMessageId!: number | string;
  public isEdit: boolean = false;

  constructor(
    private messageService: MassageService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastService
  ) {
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        this.getMessages();
      }
    })
  }

  ngOnInit() {
    this.initOrderForm();
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }

  getMessages(): void {
    this.messageService.getAllFirebase().subscribe(data => {
      this.messages = data as IMassageResponse[];
    })
  }

  initOrderForm(): void {
    this.messageForm = this.fb.group({
      status: [null, Validators.required],
    });
  }

  changeOrder(message: IMassageResponse): void {
    this.isEdit = !this.isEdit;
    this.messageForm.patchValue({
      'status': this.isEdit
    });
    
    this.currentMessageId = message.id;
    this.messageService.updateFirebase(this.messageForm.value, this.currentMessageId as string).then(() => {
      this.getMessages();
      this.toastr.showSuccess('', 'Message successfully updated');
    })
  }


  isImage(filePath: string | null ): string {        
    return decodeURIComponent(this.getFileName(filePath)).split('.')[1] || '';
  }

  
  

  getFileName(filePath: string | null): string {
    if (!filePath) return '';
    const decodedPath = decodeURIComponent(filePath);
    const fileName = decodedPath.split('/').pop()?.split('?')[0] || '';
    return fileName.startsWith('images/') ? fileName.replace('images/', '') : fileName;
  }

}
