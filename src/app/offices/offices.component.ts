import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-offices',
  templateUrl: './offices.component.html',
  styleUrls: ['./offices.component.scss'],
})
export class OfficesComponent implements OnInit {

  offices: any;

  constructor(
    private router: Router,
    private params: UtilsService,
    private service: CrudService,
    private storeService: StorageService,
    private localParam: UtilStorageService, 
    public menuCtrl: MenuController
  ) { 
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.getOffices();
  }

  getOffices(){
    this.service.get('http://localhost:56673/api/orchestra_offices/offices').subscribe((resp) => {
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

}
