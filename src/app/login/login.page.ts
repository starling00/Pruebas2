import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../services/utils.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { Router } from '@angular/router';
import { Toast } from '@ionic-native/toast/ngx';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule, FormControl} from '@angular/forms';
import {trigger,state,style,animate,transition} from '@angular/animations';

declare var OneSignal;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations:[
trigger('fadein',[
  state('void', style({opacity: 0})),
  transition('void=>*',[
    style({opacity:0}),
    animate('900ms 300ms ease-out', style({opacity: 1}))
  ])
]),
trigger('slidelefttitle',[
  transition('void=>*',[
    style({opacity: 0, transform: 'translateX(150%)'}),
    animate('900ms  ease-out',style({transform:'translateX(0%)', opacity: 1},))
  ])
])
  ]
})
export class LoginPage implements OnInit {
  
  pages = [
    {
      title: 'Home',
      url: '/menu/first/tabs/tab1'
    },
  ];
  beaconsPoints: any;
  pdata: any;
  cedula: any;
  userdata: any;
  person: any;
  personAlert: any;
  bellAlert: number = 0;
  myForm: FormGroup;
  images: any;
  showImage: any;

  constructor(private storage: Storage,
    private storeService: StorageService,
    private localParam: UtilStorageService,
    private service: CrudService,
    private params: UtilsService,
    private router: Router,
    private toast: Toast,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public formBuilder: FormBuilder)
     {
      this.myForm = this.createMyForm();
        
    
  }

slides=[
{
  img:'assets/img/Interbanc.jpg'
},{
img:'assets/img/unnamed.jpg'
}
]
slideOpts = {
  initialSlide: 1,
  autoplay: {
    disableOnInteraction: false
  },
  speed: 5000,
  zoom: {
    maxRatio: 5
  }
};
  ngOnInit() {
    this.cleanForm();
    this.getImages();
    this.presentLoadingDefault();
  }

 private createMyForm() {
    return this.formBuilder.group({
     
     cedula: ['', [Validators.required, Validators.maxLength(9)]],
     
    });
  }
  validation_messages = {
    'cedula': [
        
        { type: 'pattern', message: 'Cédula no válida' }
      ],
    }
cleanForm(){
  this.myForm.controls['cedula'].setValue('');
}
  alert(msg: string) {
    this.toast.show(msg, '5000', 'center').subscribe(
      toast => {
        console.log(toast);
      }
    );
  }
log(){
  this.router.navigateByUrl('/agencies02');
}
  login() {
    if(this.validateLogin()){
      this.router.navigateByUrl('/agencies');
      this.storeService.localSave(this.localParam.localParam.userLogged, this.cedula);
      /*this.service.saveTicket(this.params.params.userInfo +'/'+ this.cedula, null).subscribe((resp) => {

        this.userdata = resp;
        OneSignal.setExternalUserId(this.cedula);
        if(this.userdata.response== true){
          this.storeService.localSave(this.localParam.localParam.userLogged, this.cedula);
          this.router.navigateByUrl('/agencies02');
        }else{
          this.storeService.localSave(this.localParam.localParam.userLogged, this.cedula);
          this.router.navigateByUrl('/agencies');
        }
      }, (err) => {
        console.error(err);
        if(err.status == 404){
  
        }
      });*/
    }else{
      this.popUpValidation();
    }
  }

  validateLogin() {
    var value = this.cedula;
    for (var i = 0; i < value.length; i++) {
      var saveDigits = [];
      var char = value.charAt(i);
      if (i + 3 < value.length) {
        var substr = value.substring(i, i + 4);
        for(var j = 0; j < substr.length; j++){
          var subChar = substr.charAt(j);
          var intValue = parseInt(subChar) 
          saveDigits.push(intValue);
        }
        if ((saveDigits[0] + 1 == saveDigits[1] && saveDigits[1] + 1 == saveDigits[2] && saveDigits[2] + 1 == saveDigits[3]) || (saveDigits[0] - 1 == saveDigits[1] && saveDigits[1] - 1 == saveDigits[2] && saveDigits[2] - 1 == saveDigits[3])) {
          console.log("ERROR");
          return false;
        }
      }
    }
    return true;
  }

  meetings(){
    setTimeout(() => {
      this.router.navigateByUrl('/gen-meeting');
    }, 0);
  }

  agenciesMap(){
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

  //Revisa si existe una persona en el local storage
  getUserLogged(){
    this.storeService.localGet(this.localParam.localParam.userLogged).then((resp) => {
      this.person = resp;
      //console.log(this.person);
    }, (err) => {
      console.error(err);
    });
  }

  link(){
    window.location.href='https://www.ficohsa.com/';
  }

  getImages(){
    this.service.getTicket('https://13.58.166.253/marketing/api/Marketing_info').subscribe((resp) => {
      this.images= resp;
      //console.log(this.images);

    }, (err) => {
      console.error(err);
    });
  }

  async popUpValidation() {
    let popUpValidate = await this.alertCtrl.create({
      header: 'Error en el número de identidad:',
      subHeader: '',
      message:
        'No se permiten más de 4 dígitos consecutivos. <br/> Ejemplo: 1234',
      buttons: [{
        text: 'Aceptar',
        role: 'OK',
        handler: () => {

        }
      },
      ]
    });
    await popUpValidate.present();
  }

}// fin de la class
