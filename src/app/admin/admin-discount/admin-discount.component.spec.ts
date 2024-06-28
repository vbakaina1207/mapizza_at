/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDiscountComponent } from './admin-discount.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { Storage } from '@angular/fire/storage';
import { of } from 'rxjs';
import { MatDialogModule } from '@angular/material/dialog';
import { DocumentData, DocumentReference, Timestamp } from '@angular/fire/firestore';
import { DiscountService } from '../../shared/services/discount/discount.service';
import { IDiscountRequest, IDiscountResponse } from '../../shared/interfaces/discount/discount.interface';
import { SharedModule } from '../../shared/shared.module';

describe('AdminDiscountComponent', () => {
  let component: AdminDiscountComponent;
  let fixture: ComponentFixture<AdminDiscountComponent>;
  let discountService: DiscountService;
  
  const toastrServiceStub = {
    success: jasmine.createSpy(),
    error: jasmine.createSpy()
  };

  const discountServiceStub = {
    getOneFirebase: (id: string) => of({
      id: id,     
      date: null,
      name: 'test discount',
      title: '',
      description: '',
      imagePath: ''
    }),
    getAllFirebase: () => of([{
      id: 1,     
      date: null,
      name: 'test discount',
      title: '',
      description: '',
      imagePath: ''
    }]),
    createFirebase: (discount: IDiscountRequest) => {
      return Promise.resolve({ id: '5' } as DocumentReference<DocumentData>);
    },
    updateFirebase: (discount: IDiscountRequest, id: string) => {
      return Promise.resolve({ id: id } as DocumentReference<DocumentData>);
    }, 
    deleteFirebase: (id: string) => of([{
      id: id,     
      date: null,
      name: 'test discount',
      title: '',
      description: '',
      imagePath: ''
    }]),
  }

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [AdminDiscountComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        SharedModule   
      ],
      providers: [
        { provide: Storage, useValue: {} },
        { provide: ToastrService, useValue: toastrServiceStub },
        { provide: DiscountService, useValue: discountServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDiscountComponent);
    component = fixture.componentInstance;
    discountService = TestBed.inject(DiscountService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should return empty list of discounts'`, () => {
    const fixture = TestBed.createComponent(AdminDiscountComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(DiscountService);
    spyOn(service,"getAllFirebase").and.callFake(() => {
      return of([]);
    });
    app.loadDiscounts();
    expect(app.adminDiscounts).toEqual([]);
  });

  it('sending form values discount', () => {
    spyOn(component, 'editDiscount').and.callThrough();
    component.editDiscount({
      id: '1',     
      date: Timestamp.fromDate(new Date()),
      name: '1+1=3',
      title: '1+1=3',
      description: '',
      imagePath: ''
    });
    expect(component.editDiscount).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });


  it(`should return list of discounts'`, () => {
    const fixture = TestBed.createComponent(AdminDiscountComponent);
    const app = fixture.componentInstance;
    let service = fixture.debugElement.injector.get(DiscountService);
    spyOn(service,"getAllFirebase").and.callFake (() => {
      return of([
        { 
          id: '1',     
          date: Timestamp.fromDate(new Date()),
          name: '1+1=3',
          title: '1+1=3',
          description: '',
          imagePath: ''
        }
      ])
    });
    app.loadDiscounts();
    expect(app.adminDiscounts.length).toEqual(1);
  });

  it('should send add new discount', async () => {
    const discountRequest: IDiscountRequest = {       
          date: Timestamp.fromDate(new Date()),
          name: '1+1=3',
          title: '1+1=3',
          description: '',
          imagePath: ''
    };

    const expectedDiscount: IDiscountResponse = {
      id: '5',
      date: Timestamp.fromDate(new Date()),
      name: '1+1=3',
      title: '1+1=3',
      description: '',
      imagePath: ''
    };
    component.editStatus = true;
    component.currentDiscountId = '5';
    spyOn(discountService, 'createFirebase');
    component.addDiscount();
    if (component.editStatus) {
      await discountService.createFirebase(discountRequest).then((result: any) => {      
        expect(result.data()).toEqual(expectedDiscount);
      })
    }
    component.editStatus = false;    
    spyOn(discountService, 'updateFirebase');    
    if (!component.editStatus) {
      await discountService.updateFirebase(discountRequest, '5');        
    }
    expect(component).toBeTruthy();
  });

  it('delete values discount', () => {
    spyOn(component, 'deleteDiscount').and.callThrough();
    component.deleteDiscount({
      id: '5',
      date: Timestamp.fromDate(new Date()),
      name: '1+1=3',
      title: '1+1=3',
      description: '',
      imagePath: ''
    });
    spyOn(discountService, 'deleteFirebase');
    expect(component).toBeTruthy();
  });

});