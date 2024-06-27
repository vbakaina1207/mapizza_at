/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertDialogComponent } from './alert-dialog.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

describe('AlertDialogComponent', () => {
  let component: AlertDialogComponent;
  let fixture: ComponentFixture<AlertDialogComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AlertDialogComponent],
      imports: [
        HttpClientTestingModule,       
        MatDialogModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} } 
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with provided data', () => {
    expect(component.message).toBe('Будь ласка введіть номер телефону');
    expect(component.icon).toBe('');
    expect(component.isError).toBe(false);
    expect(component.btnOkText).toBe('OK');
    expect(component.btnCancelText).toBe('Cancel');
  });

  it('should initialize with default values if no data is provided', () => {
    // Manually create component with no data
    const defaultComponent = new AlertDialogComponent({
      message: '',
      icon: '',
      isError: false,
      btnOkText: '',
      btnCancelText: ''
    } as any, {} as MatDialog);
    
    expect(defaultComponent.message).toBe('Будь ласка введіть номер телефону');
    expect(defaultComponent.icon).toBe('');
    expect(defaultComponent.isError).toBe(false);
    expect(defaultComponent.btnOkText).toBe('OK');
    expect(defaultComponent.btnCancelText).toBe('Cancel');
  });

  
  it('should render message correctly', () => {
    fixture.detectChanges(); 
    const messageElement = fixture.debugElement.query(By.css('.text'));
    expect(messageElement).not.toBeNull(); 
    expect(messageElement.nativeElement.textContent).toContain('Будь ласка введіть номер телефону');
  });



  
});