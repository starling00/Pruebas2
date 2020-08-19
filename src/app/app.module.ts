import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CrudService } from './services/crud.service';
import { UtilsService } from './services/utils.service';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { Toast } from '@ionic-native/toast/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ModalPagePage } from './modal-page/modal-page.page';
import { StorageService } from './services/storage.service';
import { UtilStorageService } from './services/util-storage.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OfficesComponent } from './offices/offices.component';
import { LoginPage } from './login/login.page';
import { AgenciesComponent } from './agencies/agencies.component';
import {TermsConditionsPageModule} from  './terms-conditions/terms-conditions.module';
import{ Agencies02PageModule} from './agencies02/agencies02.module';
import { Vibration } from '@ionic-native/vibration/ngx';

@NgModule({
  declarations: [AppComponent, OfficesComponent, AgenciesComponent],
  entryComponents: [],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot({swipeBackEnabled: false}), NgxChartsModule, AppRoutingModule,
  FormsModule, HttpClientModule, AutoCompleteModule,TermsConditionsPageModule, IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CrudService, UtilsService, StorageService, UtilStorageService,
    Toast, LocalNotifications,
    Geolocation, AndroidPermissions, LocationAccuracy, LoginPage, Agencies02PageModule, Vibration
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
