import { Component, ViewChild } from '@angular/core';

import { Platform, NavController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouterOutletService } from './services/router-outlet-service.service';

declare var OneSignal;
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

      this.setWebPush();

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

  setWebPush(){
    OneSignal = OneSignal || [];
    OneSignal.push(function() {
      OneSignal.init({
        appId: "45a1ae42-f405-41a3-b17d-1c00320a387e",
        safari_web_id: "web.onesignal.auto.3f550615-46c0-4fa5-9ee8-42953ece3d19",
        notifyButton: {
          enable: true,
        },
        promptOptions: {
          slidedown: {
            enabled: true,
            autoPrompt: true,
            timeDelay: 20,
            pageViews: 3,
            actionMessage: "¡Permite las notificaciones para estar pendiente de tu ticket!",
          acceptButtonText: "Permitir",
          cancelButtonText: "No gracias",
          }
        }
      });
      //OneSignal.showSlidedownPrompt();
      //OneSignal.showHttpPrompt();
      OneSignal.showNativePrompt();
      OneSignal.setDefaultNotificationUrl("https://ficoticketdev.ficohsa.com.hn/ticket");
    });
  }
}
