import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { Platform, LoadingController, AlertController, MenuController } from '@ionic/angular';
import { Toast } from '@ionic-native/toast/ngx';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


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

  constructor(private services: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private qrScanner: QRScanner,
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
  }

  ngOnInit() {
    //this.GenerateServices();
    this.presentLoadingDefault();
  }

  ngAfterViewInit() {
    this.getAsociatedId();
    setTimeout(() => {
      //this.getBeaconsPointLocal();
      //this.getLastBeacon();
      //this.getUserLogged(); es bueno
      this.getAsociatedAlerts();
      //this.getTicketName();
      //this.getUserPosition();
      
    }, 1000);
    setTimeout(() => {
      this.popUpActiveTicket();
      this.getTicketInfo();
      this.getTicketUbi();
      this.getTicketDesti();
      this.getTicketPosition();
      this.timer();
    }, 4000);
  }
  showAlert(header, sub, msg) {
    this.alertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['OK']
    }).then(alert => alert.present());
  }
  //Metodo que crea los servicios para crear un tiquete
  GenerateServices(){
    this.services.saveTicket(this.params.params.ticketServices, null).subscribe((resp) => {
      this.generatedServices = resp;
      this.storeService.localSave(this.localParam.localParam.ticketServices, this.generatedServices);

      //console.log(this.generatedServices);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo de PRUEBA que trae los servicios existentes para crear tiquetes
  getTicketServices(){
    this.services.get('http://localhost:56673/api/orchestra_services').subscribe((resp) => {
      this.generatedServices = resp;
      this.storeService.localSave(this.localParam.localParam.ticketServices, this.generatedServices);

      console.log(this.generatedServices);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo para el numero del tiquete
  getTicketInfo() {
    /*if (this.ticketNumber != "") {
      this.ticketNumber = "A36";
      this.setVibration();
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
          //console.log(this.timeLeft);
          if (this.timeLeft == 30) {
            //this.alert("Faltan 30 segundos");
            console.log("Faltan 30 segundos");
          }
        } else {
          this.timeLeft = 60;
        }
      }, 1000)
    }*/
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

        this.services.getTicket('https://cors-anywhere.herokuapp.com/http://129.213.35.98:8011/orchestra_obtenetticketStatus/orchestra_ticketStatus/'+visitId).subscribe((resp) => {
          this.refreshedTicket = resp;
          this.storeService.localSave(this.localParam.localParam.ticketStatus, this.refreshedTicket);

          let positionInQueue = this.refreshedTicket[0].positionInQueue;
          if(this.lastPosition != positionInQueue){
            this.stopPositionPopUp = false;
            this.lastPosition = positionInQueue;
          }
          this.ticketUbi = this.officeName;
          this.ticketDesti = this.refreshedTicket[0].currentServiceName;
          this.ticketPosition = "Su posición es: "+positionInQueue;
          
          this.maxProgressBar = 1/positionInQueue;
          this.positionUpdated(positionInQueue);
          let calledFrom = this.refreshedTicket[0].servicePointName;

          if(positionInQueue == null){
            this.ticketPosition = "Su posición es: "+0;
            if (!this.stopPopUp) {
              //this.stopPopUp = true;
              if(this.popUp == null){
                this.presentAlert(calledFrom);               
                this.setVibration();
              }else if(this.popUp != null){
                this.popUp.dismiss();
                this.presentAlert(calledFrom);
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
          this.alertPositionInQueue(positionInQueue);             
          this.setVibration();
        }else if(this.positionPopUp != null){
          this.positionPopUp.dismiss();
          this.alertPositionInQueue(positionInQueue);
        }
      }
    }
  }

  getTicketStatus(visitId){
    this.services.getTicket('https://cors-anywhere.herokuapp.com/http://129.213.35.98:8011/orchestra_obtenetticketStatus/orchestra_ticketStatus/'+visitId).subscribe((resp) => {
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
          'https://cors-anywhere.herokuapp.com/http://129.213.35.98:8011/orchestra_postpone_tickets/postponeTicket/services/'+serviceId+'/branches/'+officeId+'/ticket/'+visitId+'/queue/'+queueId, userModel).subscribe((resp) => {
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
        'https://cors-anywhere.herokuapp.com/http://129.213.35.98:8011/orchestra_delete_ticket/deleteTicket/services/'+serviceId+'/branches/'+officeId+'/ticket/'+visitId+'/queueId/'+queueId).subscribe((resp) => {

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

  //Metodo que trae los beacons guardados de manera local
  getBeaconsPointLocal() {
    this.storeService.localGet(this.localParam.localParam.gatewaybeacons).then((resp) => {
      this.beaconsPoints = resp;
      //console.log(this.beaconsPoints);
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que trae el ultimo beacon detectado
  getLastBeacon() {
    this.storeService.localGet(this.localParam.localParam.lastBeacon).then((resp) => {
      this.lastBeacon = resp;
    }, (err) => {
      console.error(err);
    });
  }

  getAsociatedId() {
    this.storeService.localGet(this.localParam.localParam.alertsId).then((resp) => {
      this.asociatedId = resp;
    }, (err) => {
      console.error(err);
    });
  }

  //Metodo que saca las alertas, si sale null es porque alguno no tiene alertas y viene null
  getAsociatedAlerts() {
    //let asociatedId = [];
    let id;
    //console.log(this.asociatedId);
    for (let i = 0; i < this.asociatedId.length; i++) {
      id = this.asociatedId[i];
      //asociatedId.push(id);
      this.services.get(this.params.params.beaconurl + "/tracker/person/alert/" + id).subscribe((resp) => {
        this.asociatedIdAlert = resp;
        if (this.asociatedIdAlert.alerts.length < 1) {
          for (let x = 0; x < this.asociatedIdAlert.alerts.length; x++) {
            if (this.asociatedIdAlert.alerts[i].isResolved == false) {
              this.bellAlert++;
              this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
            }
          }
        } else if (this.asociatedIdAlert.alerts.isResolved == false) {
          this.bellAlert++;
          this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
        }
        //this.storeService.localSave(this.localParam.localParam.alertsId, asociatedId);
      }, (err) => {
        console.error(err);
      });
    }
  }

  alert(msg: string) {
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }

  QR() {
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          document.getElementsByTagName("body")[0].style.opacity = "0";
          this.qrScanner.show();
          this.scanSub = this.qrScanner.scan().subscribe((text: string) => {
            document.getElementsByTagName("body")[0].style.opacity = "1";
            this.alert('Scanned something' + text);

            this.qrScanner.hide(); // hide camera preview
            this.scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  binarySearch(items, value) {
    let startIndex = 0,
      stopIndex = items.length - 1,
      middle = Math.floor((stopIndex + startIndex) / 2);

    while (items[middle] != value && startIndex < stopIndex) {

      //adjust search area
      if (value < items[middle]) {
        stopIndex = middle - 1;
      } else if (value > items[middle]) {
        startIndex = middle + 1;
      }

      //recalculate middle
      middle = Math.floor((stopIndex + startIndex) / 2);
    }

    //make sure it's the right value
    return (items[middle] != value) ? -1 : middle;
  }

  //Metodo que busca la posicion del usuario loggeado segun el ultimo beacon leido
  getUserPosition() {
    let beaconMac;
    let index;
    let value;
    let items = [];
    let shortMac;

    for (let i = 0; i < this.beaconsPoints.length; i++) {
      items.push(this.beaconsPoints[i].shortid);
    }

    beaconMac = this.lastBeacon.id;
    shortMac = beaconMac.replace(/:/g, "");
    value = shortMac.substr(shortMac.length - 5);
    index = this.binarySearch(items, value);

    if (index > -1) {
      this.ticketUbi = this.beaconsPoints[index].point.description;
    }
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
        '<img class="my-custom-class" src="assets/img/unticket.png"></img><br> <br> Usted está siendo llamado, pasar a la ventanilla: ' + calledFrom,
      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {
          //console.log('you clicked me');
          this.stopPopUp = true;
        }
      },
      ]
    });
    await this.popUp.present();
  }

  //Popup de la posicion del cliente
  async alertPositionInQueue(positionInQueue) {
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
  trigger: { at: new Date(new Date().getTime() + 10) },
  sound: this.setSoundOnEntry(),
  data: { secret: 'key' }
  });
  this.alertSound=true;
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
