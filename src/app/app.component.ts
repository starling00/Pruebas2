import { Component, ViewChild } from '@angular/core';

import { Platform, NavController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterOutletService } from './services/router-outlet-service.service';

declare var cordova;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  @ViewChild(IonRouterOutlet, { static: false }) routerOutlet: IonRouterOutlet;

  rootPage:any = 'LoginPage';
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private routerOutletService: RouterOutletService
  ) {
    this.initializeApp();
  }

  ngAfterViewInit(): void {
    this.routerOutletService.init(this.routerOutlet);
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is('cordova')) {
        cordova.plugins.backgroundMode.setDefaults({ 
          title: 'Ficoticket',
          text: '¡Ficoticket se encuentra activo!',
          hidden: false,
          silent: false,
          sticky: true,
          resume: false,
          foreground: true,
          lockscreen: true,
         });

        cordova.plugins.backgroundMode.enable();
        cordova.plugins.backgroundMode.disableBatteryOptimizations();
        cordova.plugins.backgroundMode.on('activate', () => {
          cordova.plugins.backgroundMode.disableWebViewOptimizations(); 
        });
      }

      //Notification.requestPermission();
      
      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
        }, false);
      });
    });
  }
}
