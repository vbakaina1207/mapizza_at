/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AboutComponent } from './about.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ AboutComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render block-img-1 image', () => {
    const compiled = fixture.nativeElement;
    const imgElement = compiled.querySelector('.block-img img[src="assets/about_us/block-img-1.webp"]');
    expect(imgElement).toBeTruthy();
  });

  it('should render block-img-2 image', () => {
    const compiled = fixture.nativeElement;
    const imgElement = compiled.querySelector('.block-img img[src="assets/about_us/block-img-2.webp"]');
    expect(imgElement).toBeTruthy();
  });

  it('should render banner image', () => {
    const compiled = fixture.nativeElement;
    const imgElement = compiled.querySelector('.bg.desktop');
    expect(imgElement).toBeTruthy();
    expect(imgElement.style.backgroundImage).toContain('assets/banners/about_us.jpg');
  });

});