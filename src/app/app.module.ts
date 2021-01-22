import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppConstants } from './app.constants';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { from } from 'rxjs';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { Utility } from 'src/app/utility/utility';
import { DateFunctions } from 'src/app/utility/date-functions';
import { DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { FormsModule } from '@angular/forms';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { AuthInterceptor } from './_helper/auth.interceptor';
import { ErrorInterceptor } from './_helper/error.interceptor';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(),
    IonicStorageModule.forRoot(), AppRoutingModule,
    HttpClientModule,
    Ionic4DatepickerModule,
    FormsModule],
  providers: [
    StatusBar,
    SplashScreen,
    AppConstants,
    NetworkInterface,
    Utility,
    DateFunctions,
    DatePipe,
    BarcodeScanner,
    NativeAudio,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
