
import { TestBed, inject } from '@angular/core/testing';
import { VacancyService } from './vacancy.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { IVacancyRequest, IVacancyResponse } from '../../interfaces/vacancy/vacancy.interface';
import { Firestore } from '@angular/fire/firestore';


describe('Service: Vacancy', () => {
  let httpTestingController: HttpTestingController;
  let vacancyService: VacancyService;

    const getAllFirebaseStub = jasmine.createSpyObj('TypeProductService', ['getAllFirebase']);
    const getOneFirebaseStub = jasmine.createSpyObj('TypeProductService', ['getOneFirebase']);
    const createFirebaseStub = jasmine.createSpyObj('TypeProductService', ['createFirebase']);
    const updateFirebaseStub = jasmine.createSpyObj('TypeProductService', ['updateFirebase']);
    const deleteFirebaseStub = jasmine.createSpyObj('TypeProductService', ['deleteFirebase']);

  
  const mockVacancy: IVacancyResponse = {
    id: '1',
    name: 'Sample Vacancy',
    path: '',
    description: 'A test vacancy description',
    imagePath: ''
  };

 

  const vacancyServiceMock = {
    getOneFirebase: (id: string) => of({
      id: id,
      name: 'Sample Vacancy',
      path: '',
      description: 'A test vacancy description',
      imagePath: ''
    }),
    getAllFirebase: () => of([{
      id: 1,
      name: 'Sample Vacancy',
      path: '',
      description: 'A test vacancy description',
      imagePath: ''
    }]),
  updateFirebase: ( vacancy: Partial<IVacancyRequest>, id: string) => of({
    id: id,
    ...vacancy
  }),
  createFirebase: (vacancy: IVacancyRequest) => of({id: '1', ...vacancy }),

    deleteFirebase: (id: string) => of({
      id: id, 
      name: 'new vacancy',
      path: '',
      description: '',
      imagePath: '' }),
};
  const firestoreMock = {
    collection: jasmine.createSpy('collection').and.callFake((path: string) => {
      return {
        withConverter: () => ({
          get: () => of({ docs: [{ id: '1', data: () => mockVacancy }] })
        })
      };
    }),
    doc: jasmine.createSpy('doc').and.callFake((path: string) => {
      return {
        withConverter: () => ({
          get: () => of({ exists: true, id: '1', data: () => mockVacancy })
        })
      };
    })
  };
 

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,       
      ],
      providers: [          
        { provide: VacancyService, useValue: vacancyServiceMock },
       
        { provide: Firestore, useValue: firestoreMock } 
      ],      
      
    }).compileComponents();
    
    vacancyService = TestBed.inject(VacancyService);
    
  });

  it('should ...', inject([VacancyService], (service: VacancyService) => {
    expect(service).toBeTruthy();
  }));


  it('getOneFirebase should return a vacancy by id', (done: DoneFn) => {
    const id = '1';
    const service = TestBed.inject(VacancyService);

    service.getOneFirebase(id)
      .subscribe(vacancy => {
        expect(vacancy).toEqual(mockVacancy);
        done();
      });
  });

  it('should get all vacancies', inject([VacancyService], (service: VacancyService) => {
        service.getAllFirebase().subscribe((vacancies) => {
          expect(vacancies.length).toBeGreaterThan(0);
        });
      }));
  

      it('getOneFirebase should return a type vacancy by id', (done: DoneFn) => {
        const id = '1';
        const service = TestBed.inject(VacancyService);
    
        service.getOneFirebase(id)
          .subscribe(vacancy => {
            expect(vacancy).toBeTruthy();
            done();
          });
      });

      it('updateFirebase should return a vacancy ', async () => {
    
        const expectedData: IVacancyResponse = {
          id: '1',
          name: 'Sample Vacancy',
          path: '',
          description: 'A test vacancy description',
          imagePath: ''
        };
        const expectedPage = of(expectedData);
        const id = '1';
        updateFirebaseStub.updateFirebase.and.returnValue(of(expectedPage));
        
      });
    
      it('deleteFirebase should return a vacancy ', async () => {
        
        const expectedData: IVacancyResponse = {
          id: '1',
          name: 'Sample Vacancy',
          path: '',
          description: 'A test vacancy description',
          imagePath: ''
        };
        const expectedPage = of(expectedData);
        const id = '1';
        deleteFirebaseStub.deleteFirebase.and.returnValue(of(expectedPage));
        
      });
    
      it('createFirebase should return new vacancy ', async () => {
        
        const expectedData: IVacancyResponse = {
          id: '1',
          name: 'Sample Vacancy',
          path: '',
          description: 'A test vacancy description',
          imagePath: ''
        };
        const expectedPage = of(expectedData);
        const id = '1';
        createFirebaseStub.createFirebase.and.returnValue(of(expectedPage));
        
      });
     
});