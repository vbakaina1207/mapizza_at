import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
  
  
  
export class AlertDialogComponent implements OnInit {

  public message: string = 'Будь ласка введіть номер телефону';
  public icon: string = '';
  public buttonText = 'Ok';
  public isError: boolean = false;
  public btnOkText: string = 'OK';
  public btnCancelText: string = 'Cancel';
  
  constructor(
    @Inject(MAT_DIALOG_DATA)
    
    private data: {
        message: string;
        icon: string;
        isError: boolean;
        btnOkText: string;
        btnCancelText: string;
    },
    private dialogRef: MatDialog
  ) {
    if (data?.message) this.message = data.message;
    if (data?.icon) this.icon = data.icon;
    if (data?.isError) this.isError = data.isError;
    if (data?.btnOkText) this.btnOkText = data.btnOkText;
    if (data?.btnCancelText) this.btnCancelText = data.btnCancelText;
  }

  ngOnInit() {
  }

}
