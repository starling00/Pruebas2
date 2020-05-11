import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { MenuController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
})
export class OfficesComponent implements OnInit {
  urlId: any;
  ticketServices: any;
  offices: any;
  ticketStatus: any;
  createdTicket: any;
  constructor(
    private router: Router,
    private params: UtilsService,
    private service: CrudService,
    private storeService: StorageService,
    private localParam: UtilStorageService, 
    public menuCtrl: MenuController,
    
  ) { 
    this.menuCtrl.enable(false);
    
  }
  ngAfterViewInit(){
    this.GenerateServices();
  }
  ngOnInit() {
    this.getOffices();
    
  }

  getOffices(){
    this.service.get('http://35.222.165.70/ticketstse/api/orchestra_services/offices').subscribe((resp) => {
      this.offices = resp;
      console.log(this.offices);
    }, (err) => {
      console.error(err);
    });
  }

  goServices(id){
    this.storeService.localSave(this.localParam.localParam.ticketOffice, id);
    this.router.navigateByUrl('/heart-rate/'+id);
  }
  customActionSheetOptions: any = {
    header: 'Colors',
    subHeader: 'Select your favorite color'
  };
  getTicketStatus(visitId){
    this.service.get(this.params.params.ticketStatus+'/'+visitId).subscribe((resp) => {
      this.ticketStatus = resp;
      this.storeService.localSave(this.localParam.localParam.ticketStatus, this.ticketStatus);

      console.log(this.ticketStatus);
    }, (err) => {
      console.error(err);
    });
  }

  createTicket(){
    this.service.saveTicket(this.params.params.ticketCreate+'/serviceId/'+20+'/officeId/'+ 9, null).subscribe((resp) => {
      this.createdTicket = resp;
      this.storeService.localSave(this.localParam.localParam.createdTicket, this.createdTicket);

      this.getTicketStatus(this.createdTicket.visitId);
      console.log(this.createdTicket);
    }, (err) => {
      console.error(err);
    });
  }
 

  GenerateServices(){
    this.service.saveTicket(this.params.params.ticketServices+'/'+9, null).subscribe((resp) => {
      this.ticketServices = resp;
      this.storeService.localSave(this.localParam.localParam.ticketServices, this.ticketServices);

      console.log(this.ticketServices);
    }, (err) => {
      console.error(err);
    });
  }
  go() {
    this.createTicket();
    this.router.navigateByUrl('/menu/first/tabs/tab2');
  }
}// fin d la class
