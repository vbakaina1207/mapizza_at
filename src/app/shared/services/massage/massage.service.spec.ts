/* tslint:disable:no-unused-variable */

import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { MassageService } from './massage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Firestore, Timestamp } from '@angular/fire/firestore';
import { IMassageRequest, IMassageResponse } from '../../interfaces/massage/massage.interface';

describe('Service: Message', () => {
  let massageService: MassageService;
  let fixture: ComponentFixture<MassageService>;

  

  const data = [
    {
      id: 1, name: 'Ivan', phone: '1231234569', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),  status: false
    }
  ];

  // const serviceStub = {
  //   getOneFirebase: (id: string) =>
  //     of({ id: id, name: 'Ivan', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_message: ''}),
  // };

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
  
  beforeEach(async() => {
    await TestBed.configureTestingModule({
      providers: [       
        { provide:  MassageService, useValue: serviceStub },
      ],
      imports: [
        HttpClientTestingModule
      ]
    }).compileComponents();

    massageService = TestBed.inject(MassageService);
  });

  it('should ...', inject([MassageService], (service: MassageService) => {
    expect(service).toBeTruthy();
  }));

  it('can test getAllFirebase', () => {
    const expectedData = [
      {
        id: 1, name: 'Ivan', phone: '1231234569', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),  status: false
      }
    ];    
    massageService.getAllFirebase().subscribe((response: any) => expect(response).toEqual(expectedData));
  });

  it('should send create request and return new message', () => {
    const productRequest: IMassageRequest = {      
      name: 'Ivan', phone: '1231234569', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),  status: false
    };

    const expectedProduct: IMassageResponse = {
      id: '1',
      name: 'Ivan', phone: '1231234569', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),  status: false
    };

    massageService.createFirebase(productRequest).then((result: any) => {
      expect(result).toEqual(expectedProduct);
    });
   
  });


  it('should fetch all news details', (done) => {
    const expectedData = data;

    massageService.getAllFirebase().subscribe((response) => {
      expect(response).toEqual(expectedData);
      done();
    });

    expect(serviceStub.getAllFirebase).toHaveBeenCalled();
  });

  it('should fetch one news detail by ID', (done) => {
    const expectedData = data[0];

    massageService.getOneFirebase('1').subscribe((response) => {
      expect(response).toEqual(expectedData);
      done();
    });

    expect(serviceStub.getOneFirebase).toHaveBeenCalledWith('1');
  });

  

  it('should update existing news by ID', async () => {
    const newsUpdate: IMassageRequest = {
      name: 'Ivan', phone: '1231234569', email: 'ivan@gmail.com', description:' ', imagePath: '' , date_massage: Timestamp.fromDate(new Date('2024-12-12T00:00:00Z')),  status: false
    };

    await massageService.updateFirebase(newsUpdate, '1');
    expect(serviceStub.updateFirebase).toHaveBeenCalledWith(newsUpdate, '1');
  });

  
  it('should delete news by ID', async () => {
    await massageService.deleteFirebase('1');
    expect(serviceStub.deleteFirebase).toHaveBeenCalledWith('1');
  });


});