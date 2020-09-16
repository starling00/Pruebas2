import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { Platform, LoadingController, AlertController, MenuController, IonSlides, IonicModule, IonRouterOutlet } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterOutlet } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { RouterOutletService } from '../services/router-outlet-service.service';

declare var OneSignal;
declare var cordova;

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit, AfterViewInit {

  alertSound = false;
  points: any;
  tickets: any;
  platfrom: any;
  scanSub: any;
  asociatedId: any;
  asociatedIdAlert: any;
  bellAlert: number = 0;
  ticketNumber: string;
  ticketName: any;
  ticketUbi: string;
  ticketDesti: string;
  ticketPosition: any;
  person: any;
  beaconsPoints: any;
  lastBeacon: any;
  timeLeft: number = 60;
  content: String;
  createdTicket: any;
  ticketStatus: any;
  activeTicketStatus: any;
  refreshedTicket: any;
  interval;
  generatedServices: any;
  stopPopUp = false;
  stopPositionPopUp = false;
  popUp: any;
  positionPopUp: any;
  ticketPopUp: any;
  exitPopUp: any;
  maxProgressBar: number = 0;
  postPoneTicketInfo: any;
  lastPosition: any;
  officeName: any;
  createdDate: any;
  cancelDisable = false;
  postPoneDisable = false;
  exitDelay: any;
  crossSelling: any;
  slides = [];
  userName: any;
  newTicket: any;
  notificData: any;

  constructor(private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private toast: Toast,
    private router: Router,
    private localNotificactions: LocalNotifications,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public menuCtrl: MenuController,
    private storage: Storage,
    private vibration: Vibration,
    private routerOutletService: RouterOutletService,
    private routerOutlet: IonRouterOutlet) {
    this.menuCtrl.enable(false);
    this.platform.ready().then(() => {
      this.localNotificactions.on('click').subscribe(res => {
        let msg = res.data ? res.mydata : '';


      });
      this.localNotificactions.on('trigger').subscribe(res => {
        let msg = res.data ? res.mydata : '';
        //this.showAlert(res.title, res.text, msg);

      });
    });

    if (this.platform.is('cordova')) {
      cordova.plugins.backgroundMode.on('activate', () => {
        cordova.plugins.backgroundMode.disableWebViewOptimizations();
      });
    }

    this.getNotificationData();

    this.preventWebBackButton();
    this.destroyDelay(this.exitDelay);
  }
  @ViewChild('slides', { static: true }) slider: IonSlides;
  sliderConfig = {
    initialSlide: 1,
    autoplay: true,
    speed: 3000,
    zoom: {
      maxRatio: 5
    }
  };

  ngOnInit() {
    this.routerOutlet.swipeGesture = false;
    //this.GenerateServices();
    this.getUserLogged();
    this.presentLoadingDefault();
    clearTimeout(this.exitDelay);
    this.getCross();
  }

  ionViewDidEnter() {
    this.routerOutletService.swipebackEnabled = false;
  }
  
  ionViewDidLeave() {
    this.routerOutletService.swipebackEnabled = true;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.popUpActiveTicket();
      this.getTicketInfo();
      this.getTicketUbi();
      this.getTicketDesti();
      this.getTicketPosition();
      this.getTicketTime();
      //this.timer();
      //this.getPersonId();

    }, 4000);
  }

  ionViewWillLeave() {
    clearTimeout(this.exitDelay);
  }

  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  slidesDidLoad(slider: IonSlides) {
    slider.startAutoplay();
  }

  //Previene que se pueda volver a la página anterior y se pierda el ticket
  preventWebBackButton() {
    if (this.platform.is('android') && this.platform.is('mobileweb')) {
      history.pushState(null, null, window.top.location.pathname + window.top.location.search);
      window.addEventListener('popstate', (e) => {
        e.preventDefault();
        history.pushState(null, null, window.top.location.pathname + window.top.location.search);
      });
    } else if (this.platform.is('ios') && this.platform.is('mobileweb')) {
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
      });
    }
  }

  //Limpia el timeout del delay
  destroyDelay(exitDelay) {
    if (this.platform.is('mobileweb')) {
      window.onbeforeunload = function () {
        clearTimeout(exitDelay);
      };
    }
  }

  //Obtiene la fecha y hora al posponer un ticket
  createdTicketTime() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hour = d.getHours(),
      minutes = d.getMinutes().toString();

    let ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    minutes = minutes < '10' ? '0' + minutes : minutes;

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    if (minutes.length < 2)
      minutes = '0' + minutes;

    this.createdDate = day + '-' + month + '-' + year + ' a las: ' + hour + ':' + minutes + ' ' + ampm;
    this.storeService.localSave(this.localParam.localParam.ticketDate, this.createdDate);
  }

  //Obtiene la fecha y hora del ticket creado
  getTicketTime() {
    this.storeService.localGet(this.localParam.localParam.ticketDate).then((resp) => {
      this.createdDate = resp;

    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para el numero del tiquete
  getTicketInfo() {
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      this.createdTicket = resp;
      if (!this.createdTicket) {
        this.ticketNumber = "No hay ticket";
      } else if (this.createdTicket) {
        this.ticketNumber = this.createdTicket.ticketNumber;
        this.setVibration();
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para extraer el id de la persona logueada
  getPersonId() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;

    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para poner la ubicacion del tiquete
  getTicketUbi() {
    this.storeService.localGet(this.localParam.localParam.officeName).then((resp) => {
      this.officeName = resp;
      if (!this.officeName) {
        this.ticketUbi = "No se ha creado un ticket";
      } else if (this.officeName) {
        this.ticketUbi = this.officeName;
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para poner el destino del tiquete
  getTicketDesti() {
    this.storeService.localGet(this.localParam.localParam.ticketStatus).then((resp) => {
      this.ticketStatus = resp;
      if (!this.ticketStatus) {
        this.ticketDesti = "No se ha creado un ticket";
      } else if (this.ticketStatus) {
        this.ticketDesti = this.ticketStatus[0].currentServiceName;
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para saber cuantas personas hay en la fila
  getTicketPosition() {
    this.storeService.localGet(this.localParam.localParam.ticketStatus).then((resp) => {
      this.ticketStatus = resp;
      if (!this.ticketStatus) {
        this.ticketPosition = "No se ha creado un ticket";
      } else if (this.ticketStatus) {
        this.ticketPosition = "Su posición es: " + this.ticketStatus[0].positionInQueue;
        this.maxProgressBar = 1 / this.ticketStatus[0].positionInQueue;
      }
    }, (err) => {
      console.error(err);
    });
  }

  getNotificationData() {
    OneSignal.on('notificationDisplay', (event) => {
      console.log('OneSignal notification en TICKET', event.data);
      this.refreshTicket(event.data);
    });

    OneSignal.on('notificationDismiss', (event) => {
      console.warn('OneSignal notification dismissed:', event);
      this.refreshTicket(event.data);
    });
  }

  //Revisa si existe un tiquete creado, si existe hace un get del tiquete nuevamente para refrescarlo
  refreshTicket(data) {
    console.log(data);
    let additionalData = data;
    this.ticketNumber = additionalData.ticketId;
    let positionInQueue = additionalData.positionInQueue;
    let currentStatus = additionalData.currentStatus;
    if (this.lastPosition != positionInQueue && positionInQueue != "") {
      this.stopPositionPopUp = false;
      this.alertSound = false;
      this.lastPosition = positionInQueue;
      this.positionUpdated(positionInQueue);
    }
    this.ticketDesti = additionalData.currentServiceName;
    this.ticketPosition = "Su posición es: " + positionInQueue;

    this.maxProgressBar = 1 / positionInQueue;
    let calledFrom = additionalData.servicePointName;

    if (currentStatus == "CALLED") {
      this.ticketPosition = "Su posición es: " + 0;
      if (!this.stopPopUp) {
        if (this.popUp == null) {
          this.presentAlert(calledFrom);
        } else if (this.popUp != null) {
          this.popUp.dismiss();
          this.presentAlert(calledFrom);
        }
      }
    }
  }

  timer() {
    this.interval = setInterval(() => {
      //this.refreshTicket();
    }, 1000);
  }

  //Muestra un popup cada vez que se actualiza la posicion en la fila a partir de la posicion 5
  positionUpdated(positionInQueue) {
    if (positionInQueue == null) {
      positionInQueue = 0;
    }
    if (positionInQueue <= 5) {
      if (!this.stopPositionPopUp) {
        //this.stopPopUp = true;
        if (this.positionPopUp == null) {
          this.alertPosition();
          this.alertPositionInQueue(positionInQueue);
          this.stopPositionPopUp = true;
        } else if (this.positionPopUp != null) {
          this.positionPopUp.dismiss();
          this.alertPosition();
          this.alertPositionInQueue(positionInQueue);
          this.stopPositionPopUp = true;
        }
      }
    }
  }

  getTicketStatus(visitId) {
    this.services.getTicket(this.params.params.ticketStatus + '/' + visitId).subscribe((resp) => {
      let ticketStatus = resp;
      this.storeService.localSave(this.localParam.localParam.ticketStatus, ticketStatus);

      this.ticketNumber = ticketStatus[0].ticketId;
      this.ticketPosition = "Su posición es: " + ticketStatus[0].positionInQueue;
      this.maxProgressBar = 1 / ticketStatus[0].positionInQueue;

    }, (err) => {
      console.error(err);
    });
  }

  //Posponer tiquete
  postponeTicket() {
    this.presentLoadingDefault();
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      this.postPoneTicketInfo = resp;
      let serviceId = this.postPoneTicketInfo.serviceId;
      let visitId = this.postPoneTicketInfo.visitId;
      let queueId = this.postPoneTicketInfo.queueId;
      let officeId = this.postPoneTicketInfo.branchId;

      this.storeService.localGet(this.localParam.localParam.userModel).then((resp) => {
        let userModel = resp;

        this.services.saveTicket(
          this.params.params.postPoneTicket + '/services/' + serviceId + '/branches/' + officeId + '/ticket/' + visitId + '/queue/' + queueId + '/userId/' + this.person, userModel).subscribe((resp) => {
            this.newTicket = resp;
            this.storeService.localSave(this.localParam.localParam.createdTicket, this.newTicket);

            this.getTicketStatus(this.newTicket.visitId);
            this.createdTicketTime();
            this.postPonedTicket();
          }, (err) => {
            console.error(err);
          });
      }, (err) => {
        console.error(err);
      });

    }, (err) => {
      console.error(err);
    });
  }

  //Cancelar el tiquete
  salir() {
    this.popUpExit();
  }

  cancelTicket() {
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      let createdTicket = resp;
      let visitId = createdTicket.visitId;
      let queueId = createdTicket.queueId;
      let officeId = createdTicket.branchId;
      let serviceId = createdTicket.serviceId;

      this.services.delete(
        this.params.params.deleteTicket + '/services/' + serviceId + '/branches/' + officeId + '/ticket/' + visitId + '/queueId/' + queueId).subscribe((resp) => {

          this.cancelledTicket();

        }, (err) => {
          console.error(err);
        });
    }, (err) => {
      console.error(err);
    });
  }

  setVibration() {
    if (this.platform.is('android')) {
      navigator.vibrate([500, 500, 500]);
    } else if (this.platform.is('ios')) {
      this.vibration.vibrate(1000);
    }
  }

  delay() {
    this.exitDelay = setTimeout(() => {
      this.router.navigateByUrl('/modal-page');
      this.storage.clear();
    }, 300000);
  }

  go(id) {
    this.presentLoadingDefaults();
    this.router.navigateByUrl('/menu/first/tabs/tab1/' + '5df081fbcfc8cf0016d9eaa5');
  }

  goNotification() {
    this.router.navigateByUrl('menu/third');
  }

  //Metodo que trae los datos del usuario loggeado de manera local
  getUserLogged() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;

    }, (err) => {
      console.error(err);
    });
  }

  alert(msg: string) {
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  getCross() {
    this.storeService.localGet(this.localParam.localParam.crossSelling).then((resp) => {
      this.crossSelling = resp;
      let name = this.crossSelling.custom1;
      if(name != "---"){
       this.userName=this.crossSelling.custom1;
      }else{
        this.slides.push({ img: 'assets/img/cuentaAhorro.jpg',link:'https://www.ficohsa.com/hn/banca-personas/cuentas-depositos/', target: '_blank' })
      }

      if (this.crossSelling.Phone2 != "") {
        this.slides.push({ img: 'assets/img/extra2.jpg', link: 'javascript:void(0);', target: '' })
      }
      if (this.crossSelling.Email != "") {
        this.slides.push({ img: 'assets/img/TC.jpg', link: 'javascript:void(0);', target: '' })
      }
      if (this.crossSelling.Town != "") {
        this.slides.push({ img: 'assets/img/Interbanca.jpg', link: 'https://secure.ficohsa.com', target: '_blank' })
      }
      if (this.crossSelling.Comments2 != "") {
        this.slides.push({ img: 'assets/img/cuentaAhorro.jpg', link: 'https://www.ficohsa.com/hn/banca-personas/cuentas-depositos/', target: '_blank' })
      }
      if (this.crossSelling.TarjetadeDebito != "") {
        this.slides.push({ img: 'assets/img/TD.jpg', link: 'javascript:void(0);', target: '' })
      }
    }, (err) => {
      console.error(err);
    });
  }
  //alert
  async presentLoadingDefault() {
    let loading = await this.loadingCtrl.create({
      message: 'Por favor espere...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }
  async presentLoadingDefaults() {
    let loading = await this.loadingCtrl.create({
      message: 'Por favor espere...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }


  async presentAlert(calledFrom) {
    this.alertTi();
    this.popUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ficoticket',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/unticket.png"></img><br> <br> Su ticket número ' + this.ticketNumber + ' está siendo llamado, pasar a la ventanilla: ' + calledFrom,
      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {
          this.stopPopUp = true;
          this.cancelDisable = true;
          this.postPoneDisable = true;
          this.delay();
        }
      },
      ],
      backdropDismiss: false
    });
    await this.popUp.present();
  }

  //Popup de la posicion del cliente
  async alertPositionInQueue(positionInQueue) {
    //this.alertPosition();
    this.positionPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ficoticket:',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/tickets3.png"></img><br> <br> Faltan ' + positionInQueue + ' tickets para su llamado.',
      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {
          //console.log('you clicked me');
          this.stopPositionPopUp = true;
        }
      },
      ]
    });
    await this.positionPopUp.present();

    this.stopPositionPopUp = true;
  }

  async popUpActiveTicket() {
    this.ticketPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: '¡Ficoticket Generado!',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/check.png"></img><br> <br>Te estaremos notificando según se aproxime tu llamado.',

      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {

        }
      },
      ]
    });
    await this.ticketPopUp.present();
  }

  alertTi() {
    this.localNotificactions.schedule({
      id: 1,
      title: 'Aviso',
      text: 'Usted esta siendo llamado',
      priority: 2,
      foreground: true,
      lockscreen: true,
      vibrate: true,
      //sound: this.setSoundOnEntry(),
      data: { secret: 'key' }
    });
    this.setVibration();
  }

  alertPosition() {
    this.localNotificactions.schedule({
      id: 2,
      title: 'Aviso',
      text: 'Su posición en la fila se ha modificado',
      priority: 2,
      foreground: true,
      lockscreen: true,
      vibrate: true,
      //sound: this.setSoundOnEntry(),
      data: { secret: 'key' }
    });
    this.setVibration();
    this.alertSound = true;
  }

  setSoundOnEntry() {
    if (this.platform.is('android')) {
      return 'file://assets/sounds/1102.mp3';
    } else {
      return 'file://assets/sounds/1102.caf';
    }
  }

  async popUpExit() {
    this.exitPopUp = await this.alertCtrl.create({
      header: '¿Desea salir?',
      subHeader: '',
      message:
        'Si tiene un ticket activo se perderá',
      buttons: [{
        text: 'Sí',
        role: 'OK',
        handler: () => {
          this.cancelTicket();
          this.storage.clear();
        }
      },
      {
        text: 'No',
        role: 'cancel',
        handler: () => {
          //console.log('Cancelar');
        }
      },
      ]
    });
    await this.exitPopUp.present();
  }

  async cancelledTicket() {
    let cancelledPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ficoticket',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/cancel.png"></img><br> <br><h6>Has cancelado el ticket generado</h6>Te invitamos a seguir utilizando nuestro servicio de Ficoticket.',

      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {
          this.storage.clear();
          this.router.navigateByUrl('/modal-page');
        }
      },
      ]
    });
    await cancelledPopUp.present();
  }

  async postPonedTicket() {
    let postPonedPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ficoticket',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/newticket.png"></img><br> <br>Has generado nuevo ticket exitosamente',

      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {

        }
      },
      ]
    });
    await postPonedPopUp.present();
  }
}//fin de la classs tab2
