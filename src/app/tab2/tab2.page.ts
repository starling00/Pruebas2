import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { Platform, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

declare var cordova;

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
})
export class Tab2Page implements OnInit, AfterViewInit {

  alertSound= false;
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
    private storage: Storage) 
    {
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
  }

  ngOnInit() {
    //this.GenerateServices();
    this.presentLoadingDefault();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.popUpActiveTicket();
      this.getTicketInfo();
      this.getTicketUbi();
      this.getTicketDesti();
      this.getTicketPosition();
      this.createdTicketTime();
      this.timer();
    }, 4000);
  }

  ionViewWillLeave(){
    this.delay();
  }

  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }

  createdTicketTime(){
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        minutes = d.getMinutes().toString();

    let ampm = hour >= 12 ? 'pm' : 'am';
        hour = hour % 12;
        hour = hour ? hour : 12; // the hour '0' should be '12'
        minutes = minutes < '10' ? '0'+minutes : minutes;

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    if (minutes.length < 2)
        minutes = '0' + minutes;

    this.createdDate = day+'-'+month+'-'+year+' a las: '+hour+':'+minutes+' '+ampm;
  }

  //Metodo para el numero del tiquete
  getTicketInfo() {
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      this.createdTicket = resp;
      if(!this.createdTicket){
        this.ticketNumber = "No hay ticket";
      }else if(this.createdTicket){
        this.ticketNumber = this.createdTicket.ticketNumber;
        this.setVibration();
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que pone el nombre de la persona en el tiquete
  getTicketName() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      if(!this.person){
        this.ticketName = "Inicie sesión";
      }else if(this.person){
        this.ticketName = this.person.person.name;
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para poner la ubicacion del tiquete
  getTicketUbi() {
    this.storeService.localGet(this.localParam.localParam.officeName).then((resp) => {
      this.officeName = resp;
      if(!this.officeName){
        this.ticketUbi = "No se ha creado un ticket";
      }else if(this.officeName){
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
      if(!this.ticketStatus){
        this.ticketDesti = "No se ha creado un ticket";
      }else if(this.ticketStatus){
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
      if(!this.ticketStatus){
        this.ticketPosition = "No se ha creado un ticket";
      }else if(this.ticketStatus){
        this.ticketPosition = "Su posición es: "+this.ticketStatus[0].positionInQueue;
        this.maxProgressBar = 1/this.ticketStatus[0].positionInQueue;
      }
    }, (err) => {
      console.error(err);
    });
  }

  //Revisa si existe un tiquete creado, si existe hace un get del tiquete nuevamente para refrescarlo
  refreshTicket(){
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      this.createdTicket = resp;
      if(this.createdTicket){
        let visitId = this.createdTicket.visitId;

        this.services.getTicket('https://cdservices.ficohsa.com:9023/orchestra_obtenetticketStatus/orchestra_ticketStatus/'+visitId).subscribe((resp) => {
          this.refreshedTicket = resp;
          this.storeService.localSave(this.localParam.localParam.ticketStatus, this.refreshedTicket);

          let positionInQueue = this.refreshedTicket[0].positionInQueue;
          if(this.lastPosition != positionInQueue && positionInQueue != ""){
            this.stopPositionPopUp = false;
            this.alertSound = false;
            this.lastPosition = positionInQueue;
            this.positionUpdated(positionInQueue);
          }
          this.ticketUbi = this.officeName;
          this.ticketDesti = this.refreshedTicket[0].currentServiceName;
          this.ticketPosition = "Su posición es: "+positionInQueue;
          
          this.maxProgressBar = 1/positionInQueue;
          let calledFrom = this.refreshedTicket[0].servicePointName;

          if(positionInQueue == ""){
            this.ticketPosition = "Su posición es: "+0;
            if (!this.stopPopUp) {
              //this.stopPopUp = true;
              if(this.popUp == null){
                this.presentAlert(calledFrom);               
                //this.setVibration();
              }else if(this.popUp != null){
                this.popUp.dismiss();
                this.presentAlert(calledFrom);
                //this.setVibration();
              }
            }
          }
          this.ticketNumber = this.refreshedTicket[0].ticketId;
          //this.ticketDesti = this.refreshedTicket.queueName;
          //console.log(this.refreshedTicket);
        }, (err) => {
          if(err.status == 404){
            this.storage.remove("created-ticket");
            this.storage.remove("ticket-status");
            this.ticketNumber = "Atendido";
            this.ticketPosition = "Atendido";
            this.ticketUbi = "Atendido";
            this.ticketDesti = "Atendido";

          }
        });
      }
    }, (err) => {
      console.error(err);
    });
  }

  timer() {
    this.interval = setInterval(() => {
      this.refreshTicket();
    }, 5000);
  }

  //Muestra un popup cada vez que se actualiza la posicion en la fila a partir de la posicion 5
  positionUpdated(positionInQueue){
    if(positionInQueue == null){
      positionInQueue = 0;
    }
    if(positionInQueue <= 5){
      if (!this.stopPositionPopUp) {
        //this.stopPopUp = true;
        if(this.positionPopUp == null){
          this.alertPosition();
          this.alertPositionInQueue(positionInQueue);             
          this.stopPositionPopUp = true;
        }else if(this.positionPopUp != null){
          this.positionPopUp.dismiss();
          this.alertPosition();
          this.alertPositionInQueue(positionInQueue);
          this.stopPositionPopUp = true;
        }
      }
    }
  }

  getTicketStatus(visitId){
    this.services.getTicket('https://cdservices.ficohsa.com:9023/orchestra_obtenetticketStatus/orchestra_ticketStatus/'+visitId).subscribe((resp) => {
      let ticketStatus = resp;
      this.storeService.localSave(this.localParam.localParam.ticketStatus, ticketStatus);

      //console.log(this.ticketStatus);
    }, (err) => {
      console.error(err);
    });
  }

  //Posponer tiquete
  postponeTicket(){
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
          'https://cdservices.ficohsa.com:9023/orchestra_postpone_tickets/postponeTicket/services/'+serviceId+'/branches/'+officeId+'/ticket/'+visitId+'/queue/'+queueId, userModel).subscribe((resp) => {
          let newTicket = resp;
          this.storeService.localSave(this.localParam.localParam.createdTicket, newTicket[0]);

          this.getTicketStatus(visitId);
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
  salir(){
    this.popUpExit();
  }

  cancelTicket(){
    this.storeService.localGet(this.localParam.localParam.createdTicket).then((resp) => {
      let createdTicket = resp;
      let visitId = createdTicket.visitId;
      let queueId = createdTicket.queueId;
      let officeId = createdTicket.branchId;
      let serviceId = createdTicket.serviceId;

      this.services.delete(
        'https://cdservices.ficohsa.com:9023/orchestra_delete_ticket/deleteTicket/services/'+serviceId+'/branches/'+officeId+'/ticket/'+visitId+'/queueId/'+queueId).subscribe((resp) => {

        this.cancelledTicket();
        
      }, (err) => {
        console.error(err);
      });
    }, (err) => {
      console.error(err);
    });
  }

  setVibration() {
    navigator.vibrate([500, 500, 500]);
    //console.log("Esta vibrando");
  }

  delay(){
    setTimeout(() => {
      this.router.navigateByUrl('/modal-page');
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
      //this.ticketName = this.person.person.name;
      //console.log(this.person);
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
        '<img class="my-custom-class" src="assets/img/unticket.png"></img><br> <br> Su ticket número '+this.ticketNumber+' está siendo llamado, pasar a la ventanilla: ' + calledFrom,
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

  alertTi(){
    this.localNotificactions.schedule({
      id: 1,
      title: 'Aviso',
      text: 'Usted esta siendo llamado',
      priority: 2,
      foreground: true,
      lockscreen: true,
      vibrate: true,
      sound: this.setSoundOnEntry(),
      data: { secret: 'key' }
    });
    this.setVibration();
}

alertPosition(){
  this.localNotificactions.schedule({
  id: 2,
  title: 'Aviso',
  text: 'Su posición en la fila se ha modificado',
  priority: 2,
  foreground: true,
  lockscreen: true,
  vibrate: true,
  sound: this.setSoundOnEntry(),
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
