import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { UtilStorageService } from '../services/util-storage.service';
import { StorageService } from '../services/storage.service';
import { MenuController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.scss'],
})
export class MeetingComponent implements OnInit, AfterViewInit {

  meetingData: any;
  personName: any;
  officeName: any;
  serviceName: any;

  constructor(private router: Router,
    private params: UtilsService,
    private service: CrudService,
    private storeService: StorageService,
    private localParam: UtilStorageService, 
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController) { 

      this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.presentLoadingDefault();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.getMeetingData();
    }, 4000);
   
  }

  getMeetingData(){
    this.storeService.localGet(this.localParam.localParam.meetingData).then((resp) => {
      this.meetingData = resp;
      this.personName = this.meetingData.appointment.customers[0].name;
      this.officeName = this.meetingData.appointment.branch.name;
      this.serviceName = this.meetingData.appointment.services[0].name;

      console.log(this.meetingData);
    }, (err) => {
      console.error(err);
    });
  }

  async presentLoadingDefault() {
    let loading = await this.loadingCtrl.create({
      message: 'Por favor espere...'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 4000);
  }

}
