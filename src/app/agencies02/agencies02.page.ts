import { Component, OnInit, AfterViewInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';

@Component({
  selector: 'app-agencies02',
  templateUrl: './agencies02.page.html',
  styleUrls: ['./agencies02.page.scss'],
})
export class Agencies02Page implements OnInit, AfterViewInit {

  userId: any;
  userInfo: any;
  userName: any;

  constructor(
    public loadingCtrl: LoadingController,
    private service: CrudService,
    private params: UtilsService,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private router: Router, ) { 

    }

  ngOnInit() {
    this.presentLoadingDefault();
  }

  ngAfterViewInit(){
    setTimeout(() => {
      this.getUserId();
    }, 1000);
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
    this.service.get(this.params.params.userInfo +'/'+ id).subscribe((resp) => {
      this.userInfo = resp;
      //console.log(this.userInfo);
      this.userName = this.userInfo.custom1;
      
    }, (err) => {
      console.error(err);
    });
  }

  openOffices() {

    this.router.navigateByUrl('/offices');

  }

  openMap(){
    this.router.navigateByUrl('/agencies-maps');
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
}//fin de la pagina
