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
  selectedOffice: any;

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
    this.getUserId();
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
    this.service.getTicket('https://cors-anywhere.herokuapp.com/http://129.213.35.98:8011/orchestra_offices').subscribe((resp) => {
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
    this.service.getTicket('https://cors-anywhere.herokuapp.com/http://129.213.35.98:8011/orchestra_obtenetticketStatus/orchestra_ticketStatus/'+visitId).subscribe((resp) => {
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
      'https://cors-anywhere.herokuapp.com/http://129.213.35.98:8011/orchestra_createTicket/orchestra_createTicket/serviceId/'+this.serviceId+'/officeId/'+this.selectedOffice.id, parameters)
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
    this.service.getTicket('https://cors-anywhere.herokuapp.com/http://129.213.35.98:8011/orchestra_services/orchestra_services/officeId/'+this.selectedOffice.id).subscribe((resp) => {
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
  }

  selectedArea(area){
    this.services = this.ticketServices.filter(x => x.name.includes(area));
    
    if(this.areaDisable == false){
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
    this.router.navigateByUrl('/menu/first/tabs/tab2');
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
