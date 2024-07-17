import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMessageComponent } from './admin-message.component';
import { IMassageRequest, IMassageResponse } from '../../shared/interfaces/massage/massage.interface';
import { of } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { MassageService } from '../../shared/services/massage/massage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';

describe('AdminMessageComponent', () => {
  let component: AdminMessageComponent;
  let fixture: ComponentFixture<AdminMessageComponent>;

  const data = [
    {
      id: 1, name: 'Ivan', phone: '1231234569', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),  status: false
    }
  ];
  
  const serviceStub = {    
    getAllFirebase: jasmine.createSpy('getAllFirebase').and.returnValue(of(data)),
    getOneFirebase: jasmine.createSpy('getOneFirebase').and.returnValue(of(data[0])),
    createFirebase: (data: IMassageRequest) => Promise.resolve({
      id: '1',
      ...data
    } as IMassageResponse),
    updateFirebase: jasmine.createSpy('updateFirebase').and.returnValue(Promise.resolve()),
    deleteFirebase: jasmine.createSpy('deleteFirebase').and.returnValue(Promise.resolve())
  }

  
  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMessageComponent],
      providers: [       
        { provide:  MassageService, useValue: serviceStub },
        { provide: ToastrService, useValue: toastrServiceStub },
      ],
      imports: [
        HttpClientTestingModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
