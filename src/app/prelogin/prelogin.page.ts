import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController, ModalController, LoadingController } from '@ionic/angular';
import { PopoverController} from '@ionic/angular'
import {} from '../terms-conditions/terms-conditions.module';
import { TermsConditionsPage } from '../terms-conditions/terms-conditions.page';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { CrudService } from '../services/crud.service';
import { UtilsService } from '../services/utils.service';
@Component({
  selector: 'app-prelogin',
  templateUrl: './prelogin.page.html',
  styleUrls: ['./prelogin.page.scss'],
})
export class PreloginPage implements OnInit {
 
  ticketStatus: any;
  constructor(private router: Router,
    private alertCtrl: AlertController,
    public actionSheetController: ActionSheetController, private popover: PopoverController,
    public modalController: ModalController,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private service: CrudService,
    private params: UtilsService,
    public loadingCtrl: LoadingController,) { }

  ngOnInit() {
   this.getTicketStatus();
  }
//crea el popover
CreatePopOver(){
this.popover.create({component:TermsConditionsPage,showBackdrop:false}).then((popoverElement)=>{
  popoverElement.present();
})
}

async presentModal() {
  const modal = await this.modalController.create({
    component: TermsConditionsPage,
    cssClass: 'my-custom-class'
  });
  return await modal.present();
}

  login() {
    this.router.navigateByUrl('/login');
  }
//Trae el ticket status del local storage
getTicketStatus() {
  this.storeService.localGet(this.localParam.localParam.ticketStatus).then((resp) => {
    this.ticketStatus = resp;
    this.checkCreatedTicket(this.ticketStatus);
    console.log(this.ticketStatus);
  }, (err) => {
    console.error(err);
  });
}
//Comprueba si existe un ticket status en el local storage y si este ya fue llamado o no
  //Luego hace get al endpoint de ticket status y cumprueba si este realmente no ha sido llamado
  checkCreatedTicket(ticketStatus){
    if(ticketStatus != null && ticketStatus[0].currentStatus != "CALLED"){
      this.presentLoading();
      this.service.getTicket(this.params.params.ticketStatus+'/'+ticketStatus[0].visitId).subscribe((resp) => {
        let ticket = resp;
        this.storeService.localSave(this.localParam.localParam.ticketStatus, ticket);
        if(ticket != null && ticket[0].currentStatus != "CALLED"){
          this.router.navigateByUrl('/ticket');
        }
      }, (err) => {
        console.error(err);
      });
    }else{
      console.log("ticket status null o ya fue llamado");
    }
  }
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Consejo del día!',
      subHeader: '',
      message: 
      'Le recomendamos: <br><br> *Un super descuento 25% <br> <br><a href="https://www.fischelenlinea.com/detalle-producto?id=698&name=Ofertas&cat=46&color=6&ProName=IBUPROFENO%20600%20MG%20TABLETAS%20VIA%20ORAL"><img class="img-resp" src="../../assets/img/an.png"></img></a>',
      buttons: [{
        text: 'Cancel',
        role: 'Cancel',
        handler: () => {
          console.log('you clicked me');
        }
      },
      {
        text: 'Comprar Aqui',
        cssClass: 'secondary',
        handler: () => {
          console.log('Seconds handler')
          window.location.href='https://www.fischelenlinea.com/detalle-producto?id=698&name=Ofertas&cat=46&color=6&ProName=IBUPROFENO%20600%20MG%20TABLETAS%20VIA%20ORAL';
        }
      },
      /*{
        text: 'Open action',
        cssClass: 'primary',
        handler: async () => {
          const action = await this.actionSheetController.create({
            header: 'Farmacia Fisher',
            buttons: [
              {
                text: 'Comprar ',
                icon: 'cart',
                handler: () => {
                  window.location.href='https://www.fischelenlinea.com/detalle-producto?id=698&name=Ofertas&cat=46&color=6&ProName=IBUPROFENO%20600%20MG%20TABLETAS%20VIA%20ORAL';
                }
              },
            ]
          });
          await action.present();
        }
      },*/
      ]
    });
    await alert.present();
  }
  async presentLoading() {
    let loading = await this.loadingCtrl.create({
      message: 'Por favor espere...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

}//fin d la class
