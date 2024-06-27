/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiscountComponent } from './discount.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Timestamp } from '@angular/fire/firestore';
import { DiscountService } from '../../shared/services/discount/discount.service';


describe('DiscountComponent', () => {
  let component: DiscountComponent;
  let fixture: ComponentFixture<DiscountComponent>;
  let discountService: DiscountService;
  let router: Router;
  let toastrService: ToastrService;

  const discountServiceStub = {
    getOneFirebase: (id: string) => of({
      id: id,     
      date: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),
      name: 'test discount',
      title: '',
      description: '',
      imagePath: ''
    }),
    getAllFirebase: () => of([{
      id: 1,     
      date: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),
      name: 'test discount',
      title: '',
      description: '',
      imagePath: ''
    }]),
  }

  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [DiscountComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: DiscountService, useValue: discountServiceStub },
        { provide: ToastrService, useValue: toastrServiceStub }
      ]
    })
    .compileComponents();

    discountService = TestBed.inject(DiscountService);
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all discount', () => {
    const fixture = TestBed.createComponent(DiscountComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(DiscountService);
    spyOn(service,"getAllFirebase").and.callFake(() => {
      return of([]);
    });
    app.getDiscounts();
    expect(app.userDiscounts).toEqual([]);
  });

  


  it('should unsubscribe from router events on component destroy', () => {
    spyOn(component.eventSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.eventSubscription.unsubscribe).toHaveBeenCalled();
  });

  

  it('should handle loading no discounts', () => {
    spyOn(discountService, 'getAllFirebase').and.returnValue(of([]));
    component.getDiscounts();
    expect(component.userDiscounts).toEqual([]);
  }); 

  


  
});