import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { MenuController, LoadingController, IonSelect } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

  @ViewChild('C', {static: true}) officesList: IonSelect;
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

  constructor(
    private router: Router,
    private params: UtilsService,
    private service: CrudService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
  ) {
    this.menuCtrl.enable(false);

  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    this.presentLoadingDefault();
    this.getOffices();
    this.createdTicketTime();
    //this.getUserId();
    const navigationState = this.router.getCurrentNavigation().extras.state;
    if (
      navigationState !== undefined && navigationState !== null &&
      navigationState.data.id !== undefined && navigationState.data.id !== null
    ) {
      setTimeout(() => {
        this.officesList.value = navigationState.data.id;
      }, 1000);
    }
  }

  getUserId(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      let userId = resp;
      this.getUserInfo(userId);
    }, (err) => {
      console.error(err);
    });
  }

  getUserInfo(id){
    this.service.get(this.params.params.userInfo +'/'+ id).subscribe((resp) => {
      this.userInfo = resp;
      //console.log(this.userInfo);
    }, (err) => {
      console.error(err);
    });
  }

  getOffices(){
    this.service.getTicket(this.params.params.ticketOffices).subscribe((resp) => {
      this.offices = resp;
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
    this.service.getTicket(this.params.params.ticketStatus+'/'+visitId).subscribe((resp) => {
      this.ticketStatus = resp;
      this.storeService.localSave(this.localParam.localParam.ticketStatus, this.ticketStatus);
    }, (err) => {
      console.error(err);
    });
  }

  createTicket(){
    /*this.UserModel.level = this.userInfo.level;
    this.UserModel.custom1 = this.userInfo.custom1 + '/vip level '+ this.userInfo.level;
    this.UserModel.crossSelling = this.userInfo.crossSelling;*/
    this.UserModel.level = 'VIP Level 6';
    this.UserModel.custom1 = '---';
    this.UserModel.crossSelling = 'Extra@#@---#@#Prestamo@#@---#@#Intra@#@---#@#Segunda Tarjeta@#@---#@#Apertura de Cuentas@#@---#@#Tarjeta de Debito@#@---#@#PilTurbo@#@---#@#Aumento de Limite TC@#@---#@#Otros (TC Adicionales, Seguros)@#@---#@#';

    let parameters = {"parameters": this.UserModel}
    //console.log(parameters);
    this.storeService.localSave(this.localParam.localParam.userModel, parameters);
    
    this.service.saveTicket(
      this.params.params.ticketCreate+'/serviceId/'+this.serviceId+'/officeId/'+this.selectedOffice.id, parameters)
      .subscribe((resp) => {
      this.createdTicket = resp;
      this.storeService.localSave(this.localParam.localParam.createdTicket, this.createdTicket);

      this.getTicketStatus(this.createdTicket.visitId);
      //console.log(this.createdTicket);
    }, (err) => {
      console.error(err);
    });
  }

  GenerateServices() {
    this.service.getTicket(this.params.params.ticketServices+'/officeId/'+this.selectedOffice.id).subscribe((resp) => {
      this.ticketServices = resp;
      //this.services = this.ticketServices;
      //this.clientServices = this.services;
      this.storeService.localSave(this.localParam.localParam.ticketServices, this.ticketServices);
      this.storeService.localSave(this.localParam.localParam.officeName, this.selectedOffice.name);

      if(this.offices){
        this.areaDisable = false;
      }

    }, (err) => {
      console.error(err);
    });
  }

  getSelectedServiceId(id) {
    this.serviceId = id;
    if(this.serviceId){
      this.createDisable = false;
    }
  }

  selectedArea(area){
    this.services = this.ticketServices.filter(x => x.name.includes(area));
    if(area == "Seguros"){
      this.clientDisable = true;
      this.servDisable = false;
      this.clientServices = this.services;
    }
    else if(area != "Seguros" && this.areaDisable == false){
      this.clientDisable = false;
    }
  }

  selectedClient(client){
    this.clientServices = this.services.filter(x => x.name.includes(client));

    if(this.services && this.clientServices){
      this.servDisable = false;
    }
  }

  go() {
    this.createTicket();
    this.router.navigateByUrl('/ticket');
  }

  //Obtiene la fecha y hora
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
}// fin d la class
