import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.scss'],
})
export class AgenciesComponent implements OnInit,AfterViewInit {


  userId: any;
  userInfo: any;
  constructor(
    public loadingCtrl: LoadingController,
    private service: CrudService,
    private params: UtilsService,
    private router: Router,
    private storeService: StorageService,
    private localParam: UtilStorageService, ) { }

  ngOnInit() { 
    this.presentLoadingDefault();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.getUserId();
    }, 1000);
  }

  openOffices() {

      this.router.navigateByUrl('/offices');

  }

  openMap(){
    this.router.navigateByUrl('/agencies-maps');
  }
  getUserId(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.userId = resp;
      this.getUserInfo(this.userId);
    }, (err) => {
      console.error(err);
    });
  }

  getUserInfo(id){
    this.service.getTicket(this.params.params.getuserInfo +'/'+ id).subscribe((resp) => {
      this.userInfo = resp;
      this.storeService.localSave(this.localParam.localParam.crossSelling, this.userInfo);
      
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
    }, 2000);
  }
}//fin del componente
