import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-prelogin',
  templateUrl: './prelogin.page.html',
  styleUrls: ['./prelogin.page.scss'],
})
export class PreloginPage implements OnInit {
 

  constructor(private router: Router,
    private alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,) { }

  ngOnInit() {
   // this. presentAlert();
  }

  login() {
    this.router.navigateByUrl('/login');
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
}//fin d la class
