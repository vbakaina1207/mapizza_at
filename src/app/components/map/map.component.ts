import { AfterViewInit, Component, ElementRef, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { ToastrService } from 'ngx-toastr/toastr/toastr.service';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';
import { ToastService } from '../../shared/services/toast/toast.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})


export class MapComponent implements OnInit{

  constructor(
    private dialog: MatDialog,
    private toastr: ToastService
  ){}

  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;
  //@ViewChild(MapInfoWindow, { static: false }) infoWindow!: MapInfoWindow;
  @Input() searchAddress: string = '';
  @Output() addressFound = new EventEmitter<boolean>();


  center: google.maps.LatLngLiteral = { lat: 48.2082, lng: 16.3738 };
  zoom = 9;
  display?: google.maps.LatLngLiteral;
  coordinates!: any;
  lat!: any;
  lng!: any;
  searchMarker: google.maps.Marker | undefined;
  map!: google.maps.Map;
//.AdvancedMarkerElement


  yellowZone: google.maps.Polygon | undefined;
  greenZone: google.maps.Polygon | undefined;

  //searchAddress: string = '';

  geocoder = new google.maps.Geocoder();

  loading = false;

  mapCenter!: google.maps.LatLng;

  markerInfoContent = '';

  markerOptions: google.maps.MarkerOptions = {
    draggable: false,
    animation: google.maps.Animation.DROP,
  };

  ngOnInit(): void {
    this.getCurrentLocation();
  }


  async ngAfterViewInit(): Promise<void> {
   
    if (this.mapContainer) {
      const mapOptions: google.maps.MapOptions = {
        center: this.center,
        zoom: this.zoom
      };
  
      this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);

      /* const marker = new google.maps.marker.AdvancedMarkerElement({
        position: { lat: 49.834338, lng: 23.984174 },
        map: this.map, 
        title: 'Marker Title', // Other options like icon, animation, etc. can be added here
      }); */

     

      const greenZoneCoords: google.maps.LatLngLiteral[] = [
        { lat: 48.37035019551224, lng: 16.115671899180775 },
        { lat: 48.21593885751787, lng: 15.908304976567395 },
        { lat: 48.059224748665166, lng: 16.049753937025528 },
        { lat: 47.914919700062335, lng: 16.171976825188384 },
        { lat: 47.8872995679658, lng: 16.393076656584107 },
        { lat: 47.927804052159004, lng: 16.63065597851864 },
        { lat: 48.04453696396947, lng: 16.80781050181086 },
        { lat: 48.39771169675444, lng: 16.710306851104914 },
        { lat: 48.57156841881332, lng: 16.33402515046871 }
      ];

     

      const yellowZoneCoords: google.maps.LatLngLiteral[] = [
        { lat: 47.79051304150198, lng: 16.231028336112445 },
        { lat: 47.817262605819145, lng: 16.518046129663414 },
        { lat: 47.984824753610255, lng: 16.820170122874963 },
        { lat: 48.19710126230375, lng: 16.825663286387897 },
        { lat: 48.28644948370899, lng: 16.809145961059137 },
        { lat: 48.54520969457169, lng: 16.714426728823092 },
        { lat: 48.55889207305498, lng: 16.391071226728894 },
        { lat: 48.631363933013174, lng: 16.36763762207027 },
        { lat: 48.577932735025935, lng: 16.28595997124182 },
        { lat: 48.521566054630625, lng: 15.98658255978674 },
        { lat: 48.41594452454928, lng: 15.575968587194685 },
        { lat: 48.161921954980336, lng: 15.560862387534106 },
        { lat: 47.984824753610255, lng: 15.703684638870474 },
        { lat: 47.82095111990034, lng: 15.926157761144431 },
        { lat: 47.79051304150198, lng: 16.231028336112445 }
      ];
      

      
      this.geocoder = new google.maps.Geocoder();

      this.yellowZone = new google.maps.Polygon({
        paths: [yellowZoneCoords, greenZoneCoords],
        strokeColor: '#FFF000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#e0d24c',
        fillOpacity: 0.35,
      });
  
      this.greenZone = new google.maps.Polygon({
        paths: greenZoneCoords,
        strokeColor: '#00FF00',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#20ee64',
        fillOpacity: 0.35,
      });

      this.yellowZone.setMap(this.map);
      this.greenZone.setMap(this.map);
  
      this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
        this.moveMap(event);
      });
  
      this.map.addListener('mousemove', (event: google.maps.MapMouseEvent) => {
        this.move(event);
      });

      
      
    }
  }

 /*  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  } */
  
  onMapReady(map: google.maps.Map) {
    this.map = map;
  }

  
  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.center = event.latLng.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
  }

 
  searchLocation() {
    
    this.getCurrentLocation();
    if (this.searchAddress) {
      const addressString = this.searchAddress + ', Vienna';//
      const geocoderRequest: google.maps.GeocoderRequest = {
        address: addressString,
        region: 'at'
      };
  
      this.geocoder.geocode(geocoderRequest, async (results, status) => {
        console.log('Geocode status:', status);
        if (status === 'OK' && results && results.length > 0) {

          const location = results[0].geometry.location;
          //const types = results[0].types;
          
/* 
          const isPreciseAddress = types.includes('street_address') || types.includes('premise');
          console.log(location.lat(), location.lng(), types, isPreciseAddress), ' - location';
          if (!isPreciseAddress) {
            console.error('Адрес не является точным: ', this.searchAddress);           
            return;
          } */
          
          //const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();        
          if (this.searchMarker) {
            this.searchMarker.setMap(null);
          }
          
          this.searchMarker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: this.map,            
            title: 'Searched Location'
          });

          this.center = { lat: lat, lng: lng };
          this.zoom = 16; 
          this.lat = lat;
          this.lng = lng;
          this.map.set('zoom', 16);
          this.map.setCenter({ lat: lat, lng: lng });
          

          /* let position = this.searchMarker.getPosition();
          console.log(position, 'posotion'); */
        
          this.checkDeliveryZone({ lat, lng });

        } else if (status === 'ZERO_RESULTS') {
          console.error('No results found for the address:', this.searchAddress);          
        } else {
          console.error('Geocode was not successful for the following reason:', status);         
        }
      });
    }
  }
  

  checkDeliveryZone(location: google.maps.LatLngLiteral) {    
    const latLng = new google.maps.LatLng(location);
          const isInGreenZone = google.maps.geometry.poly.containsLocation(latLng, this.greenZone!);
          const isInYellowZone = google.maps.geometry.poly.containsLocation(latLng, this.yellowZone!);
          let message = "";
          if (isInGreenZone) {
            message = 'Address in the green delivery zone';
          } else if (isInYellowZone) {
            message = 'Address in the yellow delivery zone';
          } else {
            message = 'The address is not in the delivery zone';
          }   
          this.dialog.open(AlertDialogComponent, {
            backdropClass: 'dialog-back',
            panelClass: 'alert-dialog',
            autoFocus: false,
            data: {
              message: message,
              icon: '',
              isError: false
            }
          });
        this.toastr.showSuccess('', message);        
        this.addressFound.emit(isInGreenZone || isInYellowZone);
  }
  /* 
  KEY_API = 'AIzaSyCiZNf5DEW6DRxd6trod-rMuH7gLuRBtIs';
  //AIzaSyCiZNf5DEW6DRxd6trod-rMuH7gLuRBtIs
*/

getCurrentLocation() {
  this.loading = true;

  navigator.geolocation.getCurrentPosition(
    (position: GeolocationPosition) => {
      this.loading = false;

      const point: google.maps.LatLngLiteral = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      this.mapCenter = new google.maps.LatLng(point);
      this.map.panTo(point);

      this.markerInfoContent = "I'm here!";

      this.markerOptions = {
        draggable: false,
        animation: google.maps.Animation.DROP,
      };
    },
    (error) => {
      this.loading = false;

      if (error.PERMISSION_DENIED) {
        this.toastr.showError("Couldn't get your location", 'Permission denied');
      } else if (error.POSITION_UNAVAILABLE) {
        this.toastr.showError(
          "Couldn't get your location",
          'Position unavailable'
        );
      } else if (error.TIMEOUT) {
        this.toastr.showError("Couldn't get your location", 'Timed out');
      } else {
        this.toastr.showError(error.message, `Error: ${error.code}`);
      }
    },
    { enableHighAccuracy: true,  }
  );
}
}

