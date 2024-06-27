/* tslint:disable:no-unused-variable */
import {  ComponentFixture, TestBed, waitForAsync, inject} from '@angular/core/testing';
import {  InjectionToken } from '@angular/core';

import { MapComponent } from './map.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleMapsModule } from '@angular/google-maps';


export const GOOGLE = new InjectionToken('google');
export const googleFactory = () => google;

const mockGoogle: {
  maps: {
    Map: jasmine.Spy<(mapDiv: Element, opts?: google.maps.MapOptions) => google.maps.Map>;
    LatLng: jasmine.Spy<(lat: number, lng: number) => google.maps.LatLng>;
    LatLngLiteral: jasmine.Spy<() => google.maps.LatLngLiteral>;
    Geocoder: jasmine.Spy<() => google.maps.Geocoder>;
    Polygon: jasmine.Spy<(options?: google.maps.PolygonOptions) => google.maps.Polygon>;
    geometry: {
      poly: {
        containsLocation: jasmine.Spy<(point: google.maps.LatLng, polygon: google.maps.Polygon) => boolean>;
      };
    };
  };
} = {
  maps: {
    Map: jasmine.createSpy('Map'),
    LatLng: jasmine.createSpy('LatLng'),
    LatLngLiteral: jasmine.createSpy('LatLngLiteral'),
    Geocoder: jasmine.createSpy('Geocoder'),
    Polygon: jasmine.createSpy('Polygon'),
    geometry: {
      poly: {
        containsLocation: jasmine.createSpy('containsLocation')
      }
    }
  }
};



describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;


  beforeEach(waitForAsync(() => {
  const mockGoogle = jasmine.createSpyObj('google', ['maps']);
    TestBed.configureTestingModule({
      declarations: [MapComponent],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientTestingModule,
        GoogleMapsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: ToastrService, useValue: {} },
        { provide: GOOGLE, useFactory: googleFactory}
      ],
     
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



});