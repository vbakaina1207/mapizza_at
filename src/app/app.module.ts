import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';

import { AuthDialogComponent } from './components/auth-dialog/auth-dialog.component';
import { AuthAddressComponent } from './components/auth-address/auth-address.component';
import { AuthAdditionComponent } from './components/auth-addition/auth-addition.component';
import { AlertDialogComponent } from './components/alert-dialog/alert-dialog.component';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { BasketComponent } from './components/basket/basket.component';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbCarouselModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TermsDialogComponent } from './components/terms-dialog/terms-dialog.component'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
      FooterComponent,
      AuthDialogComponent,
      AuthAddressComponent,
      AuthAdditionComponent,
      BasketComponent,
      AlertDialogComponent,
      TermsDialogComponent     
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
      //{"projectId":"mapizza-at","appId":"1:191629505121:web:4318a2fddf5d10a297f020","storageBucket":"mapizza-at.appspot.com","apiKey":"AIzaSyBF_eWsyAc6W6LPCqzRQzDJqSQBxABOXH0","authDomain":"mapizza-at.firebaseapp.com","messagingSenderId":"191629505121"})),
    provideStorage(() => getStorage()),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      timeOut: 5000,
    }),
    SharedModule,
    HttpClientModule,
    NgbModule,
    NgbCarouselModule,
    GoogleMapsModule,
    FormsModule
  ],
  providers: [
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
