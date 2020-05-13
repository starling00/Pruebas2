import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agencies',
  templateUrl: './agencies.component.html',
  styleUrls: ['./agencies.component.scss'],
})
export class AgenciesComponent implements OnInit {

  constructor(
    public loadingCtrl: LoadingController,
    private service: CrudService,
    private params: UtilsService,
    private router: Router, ) { }

  ngOnInit() { }


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
    }, 4000);
  }
}//fin del componente
