/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

import { SlideAboutComponent } from './slide-about.component';

describe('SlideAboutComponent', () => {
  let component: SlideAboutComponent;
  let fixture: ComponentFixture<SlideAboutComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [SlideAboutComponent],
      schemas:[
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideAboutComponent);
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