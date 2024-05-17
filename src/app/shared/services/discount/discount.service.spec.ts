/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DiscountService } from './discount.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IDiscountRequest, IDiscountResponse } from '../../interfaces/discount/discount.interface';


describe('Service: Discount', () => {
  let httpTestingController: HttpTestingController;
  let discountService: DiscountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ DiscountService ],
      imports: [
        HttpClientTestingModule
      ]
    });
    httpTestingController = TestBed.get( HttpTestingController );
    discountService = TestBed.get(DiscountService);
  });


  afterEach(() => {
    httpTestingController.verify();
  });

  it('should ...', inject([DiscountService], (service: DiscountService) => {
    expect(service).toBeTruthy();
  }));

  it('can test HttpClient.get', () => {
    const data = [
      {
        id: 1,
        date: '12-5-2023',
        name: '1+1=3',
        title: '1+1=3',
        description: '',
        imagePath:  ''
      },
      {
        id: 2,
        date: '22-5-2023',
        name: '50%',
        title: '50%',
        description: '',
        imagePath:  ''
      }]
    discountService.getAllFirebase().subscribe((response: any) => expect(response).toBe(data));
    const req = httpTestingController.expectOne('http://localhost:3000/discounts');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  // it('should send create request and return new discount', () => {
  //   const discountRequest: IDiscountRequest = {
  //     date: new Date(),
  //     name: '1+1=3',
  //     title: '1+1=3',
  //     description: '',
  //     imagePath:  ''
  //   };

  //   const expectedDiscount: IDiscountResponse = {
  //     id: 3,
  //     date: new Date(),
  //     name: '1+1=3',
  //     title: '1+1=3',
  //     description: '',
  //     imagePath:  ''
  //   };

  //   discountService.createFirebase(discountRequest).subscribe(result => {
  //     expect(result).toEqual(expectedDiscount);
  //   });

  //   const expectedUrl = 'http://localhost:3000/discounts';
  //   const testRequest = httpTestingController.expectOne(expectedUrl);

  //   expect(testRequest.request.method).toEqual('POST');
  //   expect(testRequest.request.body).toEqual(discountRequest);

  //   testRequest.flush(expectedDiscount);
  // });

});
