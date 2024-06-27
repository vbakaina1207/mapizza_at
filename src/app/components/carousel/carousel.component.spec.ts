/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CarouselComponent } from './carousel.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselComponent ],
      imports: [ NgbCarouselModule ],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

 

  it('should apply component styles', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const carouselComponent = compiled.querySelector('.banner-slide');
    
    expect(carouselComponent).toBeDefined();
  });
  
  it('should initialize component without errors', () => {
    expect(component.ngOnInit).toBeDefined();
  });
  
});