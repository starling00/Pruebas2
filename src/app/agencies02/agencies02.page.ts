import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-agencies02',
  templateUrl: './agencies02.page.html',
  styleUrls: ['./agencies02.page.scss'],
})
export class Agencies02Page implements OnInit {

  constructor(
    public loadingCtrl: LoadingController,
    private service: CrudService,
    private params: UtilsService,
    private router: Router, 
  ) { }

  ngOnInit() {
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
  }, 4000);
}
}//fin de la pagina
