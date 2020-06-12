import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { MenuController, LoadingController, IonSelect } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
})
export class OfficesComponent implements OnInit {

  @ViewChild('C', {static: true}) officesList: IonSelect;

  urlId: any;
  ticketServices: any;
  offices: any;
  ticketStatus: any;
  createdTicket: any;
  officeId: any;
  serviceId: any;

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

  getOffices() {
    this.service.get('http://13.58.166.253/ficoTickets/api/orchestra_services/offices').subscribe((resp) => {
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
    this.service.get(this.params.params.ticketStatus + '/' + visitId).subscribe((resp) => {
      this.ticketStatus = resp;
      this.storeService.localSave(this.localParam.localParam.ticketStatus, this.ticketStatus);

      console.log(this.ticketStatus);
    }, (err) => {
      console.error(err);
    });
  }

  createTicket() {
    this.service.saveTicket(this.params.params.ticketCreate + '/serviceId/' + this.serviceId + '/officeId/' + this.officeId, null).subscribe((resp) => {
      this.createdTicket = resp;
      this.storeService.localSave(this.localParam.localParam.createdTicket, this.createdTicket);

      this.getTicketStatus(this.createdTicket.visitId);
      console.log(this.createdTicket);
    }, (err) => {
      console.error(err);
    });
  }

  GenerateServices(id) {
    this.officeId = id;
    this.service.saveTicket(this.params.params.ticketServices + '/' + id, null).subscribe((resp) => {
      this.ticketServices = resp;
      this.storeService.localSave(this.localParam.localParam.ticketServices, this.ticketServices);

      console.log(this.ticketServices);
    }, (err) => {
      console.error(err);
    });
  }

  getSelectedServiceId(id) {
    this.serviceId = id;
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
