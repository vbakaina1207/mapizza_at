import { Component, Injectable, OnInit } from '@angular/core';
import { GoogleMapsModule } from "@angular/google-maps";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent  {

   center: google.maps.LatLngLiteral = {lat: 24, lng: 12};
   zoom = 4;
   display?: google.maps.LatLngLiteral;
  coordinates!: any;
   lat!: any;
   lng!: any;
  
  //markerOptions: google.maps.MarkerOptions = { icon: 'https://mapizza.com.ua/wp-content/themes/mamma-italiana/img/set-marker.png' };
  markerPositions: google.maps.LatLngLiteral[] = [{ lat: 24, lng: 12 }];

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }
  /* center: google.maps.LatLngLiteral = { 
    lat: 49.834338, 
    lng: 23.984174 
  };
  zoom = 12;
  display: google.maps.LatLngLiteral | undefined;
  //markerOptions: google.maps.MarkerOptions = { icon: 'https://mapizza.com.ua/wp-content/themes/mamma-italiana/img/set-marker.png' };

  KEY_API = 'AIzaSyCiZNf5DEW6DRxd6trod-rMuH7gLuRBtIs';
  //AIzaSyCiZNf5DEW6DRxd6trod-rMuH7gLuRBtIs

  constructor() {}

  ngOnInit(): void {}

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = (event.latLng.toJSON());
}

move(event: google.maps.MapMouseEvent) {
  if (event.latLng != null) this.display = event.latLng.toJSON();
} */
}

