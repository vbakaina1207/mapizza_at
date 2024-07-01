/* tslint:disable:no-unused-variable */
import {  ComponentFixture, TestBed, waitForAsync, inject} from '@angular/core/testing';
import {  Component, InjectionToken } from '@angular/core';

import { MapComponent } from './map.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GoogleMapsModule } from '@angular/google-maps';
import { RouterModule, Routes, provideRouter } from '@angular/router';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../../../environments/environment';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';



@Component({
  selector: 'app-blank',
  template: '<p>Blank Component</p>'
})
class BlankComponent {}

const routes: Routes = [
  { path: '', component: BlankComponent },
  { path: 'test', component: BlankComponent }
];


export const GOOGLE = new InjectionToken('google');
export const googleFactory = () => google;

// const mockGoogle: {
//   maps: {
//     Map: jasmine.Spy<(mapDiv: Element, opts?: google.maps.MapOptions) => google.maps.Map>;
//     LatLng: jasmine.Spy<(lat: number, lng: number) => google.maps.LatLng>;
//     LatLngLiteral: jasmine.Spy<() => google.maps.LatLngLiteral>;
//     Geocoder: jasmine.Spy<() => google.maps.Geocoder>;
//     Polygon: jasmine.Spy<(options?: google.maps.PolygonOptions) => google.maps.Polygon>;
//     geometry: {
//       poly: {
//         containsLocation: jasmine.Spy<(point: google.maps.LatLng, polygon: google.maps.Polygon) => boolean>;
//       };
//     };
//   };
// } = {
//   maps: {
//     Map: jasmine.createSpy('Map'),
//     LatLng: jasmine.createSpy('LatLng'),
//     LatLngLiteral: jasmine.createSpy('LatLngLiteral'),
//     Geocoder: jasmine.createSpy('Geocoder'),
//     Polygon: jasmine.createSpy('Polygon'),
//     geometry: {
//       poly: {
//         containsLocation: jasmine.createSpy('containsLocation')
//       }
//     }
//   }
// };


const mockGoogle = {
  maps: {
    Map: jasmine.createSpy().and.returnValue({}),
    LatLng: jasmine.createSpy().and.returnValue({}),
    Geocoder: jasmine.createSpy().and.returnValue({
      geocode: jasmine.createSpy().and.callFake((request, callback) => {
        // Mock geocode response if needed
        const results = [
          {
            geometry: {
              location: {
                lat: () => 48.2082,
                lng: () => 16.3738
              }
            }
          }
        ];
        callback(results, 'OK');
      })
    }),
    Polygon: jasmine.createSpy().and.returnValue({}),
    geometry: {
      poly: {
        containsLocation: jasmine.createSpy().and.returnValue(true) // Example spy behavior
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
      declarations: [MapComponent, BlankComponent],
      imports: [
        MatDialogModule,        
        HttpClientTestingModule,
        GoogleMapsModule,
        RouterModule.forRoot( routes ), 
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: ToastrService, useValue: {} },
        { provide: GOOGLE, useFactory: googleFactory},
        { provide: 'google', useValue: mockGoogle },
        provideRouter(routes)
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