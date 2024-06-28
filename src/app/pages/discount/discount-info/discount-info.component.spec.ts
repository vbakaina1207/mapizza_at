/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { DiscountInfoComponent } from './discount-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { ActivatedRoute, RouterModule, Routes, provideRouter } from '@angular/router';
import { DiscountService } from '../../../shared/services/discount/discount.service';
import { Component } from '@angular/core';



@Component({
  selector: 'app-blank',
  template: '<p>Blank Component</p>'
})
class BlankComponent {}

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'test', component: BlankComponent }
];



describe('DiscountInfoComponent', () => {
  let component: DiscountInfoComponent;
  let fixture: ComponentFixture<DiscountInfoComponent>;
  let discountService : DiscountService;

  const mockTimestamp = Timestamp.fromDate(new Date('2024-12-12T10:45:00Z'));
  const mockTimestampString = mockTimestamp.toDate().toString(); 

  const discountServiceStub = {
    getOneFirebase: (id: string) => of({
      id: id,     
      date:  mockTimestamp, 
      name: 'test discount',
      title: '',
      description: '',
      imagePath: ''
    }),
  }

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [DiscountInfoComponent],
      imports: [
        HttpClientTestingModule,
        RouterModule.forRoot( routes ), 
      ],
      providers: [
        { provide: DiscountService, useValue: discountServiceStub },
        provideRouter(routes)
        // {
        //   provide: ActivatedRoute,
        //   useValue: {
        //     data: of({ discountInfo: discountServiceStub })
        //   }
        // }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  

  it('loading discount', () => {
    const DISCOUNT_ID = '1';
    const data = [
      {
        id: 1,     
      date:  mockTimestamp, 
      name: 'test discount',
      title: '',
      description: '',
      imagePath: ''
      }
    ]    
    if (DISCOUNT_ID){
      discountService?.getOneFirebase(DISCOUNT_ID).subscribe(result => {
        expect(result).toEqual(data);
      });
    }
    expect(component).toBeTruthy();
  });



 
});