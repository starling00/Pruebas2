import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, LoadingController } from '@ionic/angular';
import { CrudService } from '../services/crud.service';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../services/utils.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { Router } from '@angular/router';
import { Toast } from '@ionic-native/toast/ngx';
import { FormGroup, FormBuilder, Validators,ReactiveFormsModule, FormControl} from '@angular/forms';
import {trigger,state,style,animate,transition} from '@angular/animations'

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
  autoplay: true,
        speed: 1000,
        zoom: {
          maxRatio: 5
        }
};
  ngOnInit() {
    this.cleanForm();
    this.getImages();
  }

 private createMyForm() {
    return this.formBuilder.group({
     
     cedula: ['', [Validators.required, Validators.maxLength(13)]],
     
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
   /* this.router.navigateByUrl('/agencies');*/
    this.service.saveTicket(this.params.params.userInfo +'/'+ this.cedula, null).subscribe((resp) => {

      this.userdata = resp;
      console.log(this.userdata);
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
    });
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
    this.service.get('https://localhost:44323/api/Marketing_info').subscribe((resp) => {
      this.images= resp;
      //console.log(this.images);

    }, (err) => {
      console.error(err);
    });
  }

}// fin de la class
