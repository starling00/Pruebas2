import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { MenuController, LoadingController, IonSelect, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { exit } from 'process';

export interface parameters {
  level: String,
  custom1: String,
  crossSelling: String
}

@Component({
  selector: 'app-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
})
export class OfficesComponent implements OnInit {

  @ViewChild('C', { static: true }) officesList: IonSelect;
  UserModel: parameters = {
    level: '',
    custom1: '',
    crossSelling: ''
  }

  urlId: any;
  ticketServices: any;
  offices: any;
  services: any;
  ticketStatus: any;
  createdTicket: any;
  userInfo: any;
  officeId: any;
  serviceId: any;
  clientServices: any;
  areaDisable = true;
  clientDisable = true;
  servDisable = true;
  createDisable = true;
  selectedOffice: any;
  createdDate: any;
  totalPeople: any;
  nameArea: any;
  totalClientes = 0;
  horaNow: any;

  constructor(
    private router: Router,
    private params: UtilsService,
    private service: CrudService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
  ) {
    this.menuCtrl.enable(false);

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    this.presentLoadingDefault();
    this.getOffices();
    //this.getUserId();
    this.getUserInfo();
    const navigationState = this.router.getCurrentNavigation().extras.state;
    if (
      navigationState !== undefined && navigationState !== null &&
      navigationState.data.id !== undefined && navigationState.data.id !== null
    ) {
      setTimeout(() => {
        // console.log(navigationState.data.id)
        const office = this.filterOfficePerID(navigationState.data.id);
        console.log(office);
        // console.log(this.offices[office]);
        this.officesList.value = this.offices[office];
      }, 2500);
    }
  }

  filterOfficePerID(id):number{
    let i = -1;
    this.offices.forEach((office, index) => {
      if(office.id === id){
        console.log(index);
        i = index;
      }
    });
    return i;
  }

  /*getUserId() {
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      let userId = resp;
      this.getUserInfo();
    }, (err) => {
      console.error(err);
    });
  }*/

  getUserInfo() {
    this.storeService.localGet(this.localParam.localParam.crossSelling).then((resp) => {
      this.userInfo = resp;
      console.log(this.userInfo);
    }, (err) => {
      console.error(err);
    });
  }

  getOffices() {

    this.service.getTicket(this.params.params.ticketOffices).subscribe((resp) => {
      this.offices = resp;
      console.log(this.offices);

    }, (err) => {
      console.error(err);
    });
  }

  goServices(id) {
    this.storeService.localSave(this.localParam.localParam.ticketOffice, id);
    this.router.navigateByUrl('/heart-rate/' + id);
  }

  customActionSheetOptions: any = {
    header: 'Colors',
    subHeader: 'Select your favorite color'
  };

  getTicketStatus(visitId) {
    this.service.getTicket(this.params.params.ticketStatus + '/' + visitId).subscribe((resp) => {
      this.ticketStatus = resp;
      this.storeService.localSave(this.localParam.localParam.ticketStatus, this.ticketStatus);
    }, (err) => {
      console.error(err);
    });
  }
  createTicket() {
   this.UserModel.level = this.userInfo.level;
    this.UserModel.custom1 = this.userInfo.custom1 + '/vip level '+ this.userInfo.level;
    this.UserModel.crossSelling = this.userInfo.crossSelling;
    /* this.UserModel.level = 'VIP Level 6';
    this.UserModel.custom1 = '---';
    this.UserModel.crossSelling = 'Extra@#@---#@#Prestamo@#@---#@#Intra@#@---#@#Segunda Tarjeta@#@---#@#Apertura de Cuentas@#@---#@#Tarjeta de Debito@#@---#@#PilTurbo@#@---#@#Aumento de Limite TC@#@---#@#Otros (TC Adicionales, Seguros)@#@---#@#';*/

    let parameters = { "parameters": this.UserModel }
    //console.log(parameters);
    this.storeService.localSave(this.localParam.localParam.userModel, parameters);

    this.service.saveTicket(
      this.params.params.ticketCreate + '/serviceId/' + this.serviceId + '/officeId/' + this.selectedOffice.id, parameters)
      .subscribe((resp) => {
        this.createdTicket = resp;
        this.storeService.localSave(this.localParam.localParam.createdTicket, this.createdTicket);

        this.getTicketStatus(this.createdTicket.visitId);
        this.createdTicketTime();
        //console.log(this.createdTicket);
      }, (err) => {
        console.error(err);
      });
  }

  GenerateServices() {
    this.presentLoading();
    this.service.getTicket(this.params.params.ticketServices + '/officeId/' + this.selectedOffice.id).subscribe((resp) => {
      this.ticketServices = resp;
      //this.services = this.ticketServices;
      //this.clientServices = this.services;
      this.storeService.localSave(this.localParam.localParam.ticketServices, this.ticketServices);
      this.storeService.localSave(this.localParam.localParam.officeName, this.selectedOffice.name);

      if (this.offices) {
        this.areaDisable = false;
      
        this.closedAgency();
      }

    }, (err) => {
      console.error(err);
    });
  }

  closedAgency() {
   
    let open
    let close
    let horaInt
    let openShort
    let closeShort
    let o: Date = new Date();
    let hours = o.getHours(),
      minut = o.getMinutes().toString();
      //hours = hours ? hours : 12;
    minut = minut < '10' ? '0' + minut : minut;
    if (minut.length < 2)
      minut = '0' + minut;
    console.log(this.selectedOffice.id);
    open = this.selectedOffice.openTime;
    close= this.selectedOffice.closeTime;
    openShort = parseInt(open.replace(/:/g, ""));
    closeShort=parseInt(close.replace(/:/g, ""));
    horaInt = parseInt(hours+minut);
    if (openShort > horaInt) {
      this.popupClose();
      this.createDisable = true;
      this.areaDisable = true;
      this.clientDisable = true;
      this.servDisable = true;
     } else if(closeShort < horaInt){
        this.popupClose();
        this.createDisable = true;
        this.areaDisable = true;
        this.clientDisable = true;
        this.servDisable = true;
      }else{
       
        this.getTotalPeople();
       
      }
      
   
    console.log(openShort);
    console.log(horaInt);
    console.log(closeShort);


  }
  getSelectedServiceId(id) {
    this.serviceId = id;
    if (this.serviceId) {
      this.createDisable = false;
    }
  }

  selectedArea(area) {
    this.services = this.ticketServices.filter(x => x.name.includes(area));
    if (area == "Seguros") {
      this.clientDisable = true;
      this.servDisable = false;
      this.clientServices = this.services;
    }
    else if (area != "Seguros" && this.areaDisable == false) {
      this.clientDisable = false;
    }
  }

  selectedClient(client) {
    this.clientServices = this.services.filter(x => x.name.includes(client));

    if (this.services && this.clientServices) {
      this.servDisable = false;
    }
  }

  go() {
    this.createTicket();
    this.router.navigateByUrl('/ticket');
  }

  //Obtiene la fecha y hora
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
    this.horaNow = hour + minutes;
    this.storeService.localSave(this.localParam.localParam.ticketDate, this.createdDate);
  }

  async presentLoadingDefault() {
    let loading = await this.loadingCtrl.create({
      message: 'Por favor espere...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  getTotalPeople() {
    this.service.getTicket(this.params.params.servicesWaiting + this.selectedOffice.id).subscribe((resp) => {
      this.totalPeople = resp;
      console.log(this.totalPeople);
      this.nameArea = this.totalPeople.areas;
      for (let i = 0; i < this.nameArea.length; i++) {
        this.totalClientes += this.nameArea[i].total;
        console.log(this.totalClientes);
      }//primer for
      if (this.totalClientes > 0) {
        this.pupTotalPeople(this.nameArea);
        this.totalClientes = 0;
      } else {
        this.pupCeroPeople();
      }
    }, (err) => {
      console.error(err);
    });
  }
  async pupTotalPeople(areas: any) {
    let postPonedPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ficoticket',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/numeroClientes.png"></img><br> <br>De momento contamos con clientes en las siguientes áreas:  <br><br>' + areas[0].name + ': ' + areas[0].total + '<br>' + areas[1].name + ': ' + areas[1].total + '<br>' + areas[2].name + ': ' + areas[2].total,

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
  async pupCeroPeople() {
    let postPonedPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Ficoticket',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/nohaypersonas.png"></img><br><p class="agenciaCenter">De momento no hay clientes en espera para la oficina seleccionada</p>',

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
  async popupClose() {
    let postPonedPopUp = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'Aviso',
      subHeader: '',
      message:
        '<img class="my-custom-class" src="assets/img/lock.png"></img><br><br><p class="agenciaCenter">La agencia seleccionada se encuentra cerrada por su horario de atención.</p>',

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
  
  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      message: 'Por favor espere...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 1000);
  }
}// fin d la class
