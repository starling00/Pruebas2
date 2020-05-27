import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CrudService } from './services/crud.service';
import { UtilsService } from './services/utils.service';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { BeaconService } from './services/beacon.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { BLE } from '@ionic-native/ble/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ModalPagePage } from './modal-page/modal-page.page';
import { SeePeoplePage } from './see-people/see-people.page';
import { StorageService } from './services/storage.service';
import { UtilStorageService } from './services/util-storage.service';
import { ModalNotificationPage } from './modal-notification/modal-notification.page';
import { HeartrateComponent } from './heartrate/heartrate.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OfficesComponent } from './offices/offices.component';
import { GenerateMeetingComponent } from './generate-meeting/generate-meeting.component';
import { MeetingComponent } from './meeting/meeting.component';
import { LoginPage } from './login/login.page';
import { AgenciesComponent } from './agencies/agencies.component';

@NgModule({
  declarations: [AppComponent, ModalNotificationPage, HeartrateComponent, OfficesComponent, GenerateMeetingComponent, MeetingComponent, AgenciesComponent],
  entryComponents: [ ModalNotificationPage],
  imports: [BrowserModule, BrowserAnimationsModule, IonicModule.forRoot(), NgxChartsModule, AppRoutingModule, FormsModule, HttpClientModule, AutoCompleteModule, IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CrudService, UtilsService, StorageService, UtilStorageService,
    BeaconService, IBeacon, BLE, Toast, QRScanner, LocalNotifications,
    SeePeoplePage, Geolocation, LoginPage
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
