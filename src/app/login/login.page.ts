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
    animate('900ms 100ms ease-out', style({opacity: 1}))
  ])
]),
trigger('slidelefttitle',[
  transition('void=>*',[
    style({opacity: 0, transform: 'translateX(150%)'}),
    animate('900ms 300ms ease-out',style({transform:'translateX(0%)', opacity: 1},))
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

  ngOnInit() {
    //this.getUserLogged();
    /*setTimeout(() => {
      if(this.person.person != null){
        this.router.navigateByUrl('/menu/first/tabs/tab2');
      }
    }, 1000);*/
    this.cleanForm();
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

  login() {

    //this.getBeconsPoints();
    this.router.navigateByUrl('/agencies');

    /*this.service.get(this.params.params.staffurl + "/asocieted/cid/" + this.cedula).subscribe((resp) => {

      this.userdata = resp;

      this.storeService.localSave(this.localParam.localParam.userLogged, this.userdata);
      //this.storeService.localSave(this.localParam.localParam.alerts, 10);
      this.getAsociatedAlerts();
      

      console.log(this.userdata);
    }, (err) => {
      console.error(err);
      this.alert(JSON.stringify(err));
    });*/
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

  //Metodo que saca las alertas, si sale null es porque alguno no tiene alertas y viene null
  getAsociatedAlerts(){
    let asociatedId = [];
    let id;
    for(let i = 0; i < this.userdata.asocietedpeople.length; i++){
      id = this.userdata.asocietedpeople[i].id;
      asociatedId.push(id);
      this.storeService.localSave(this.localParam.localParam.alertsId, asociatedId);
      this.service.get(this.params.params.beaconurl+"/tracker/person/alert/"+id).subscribe((resp) => {
        this.personAlert = resp;
        if(this.personAlert.alerts.length < 1){
          for(let x = 0; x < this.personAlert.alerts.length; x++){
            if(this.personAlert.alerts[i].isResolved == false){
              this.bellAlert ++;
              this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
            }
          }
        }else if(this.personAlert.alerts.isResolved == false){
          this.bellAlert ++;
          this.storeService.localSave(this.localParam.localParam.alerts, this.bellAlert);
        }
      }, (err) => {
        console.error(err);
      });
      
    }
  }

  //Extrae todos los beacons relacionados al un punto

  getBeconsPoints() {

    this.service.get(this.params.params.gatewaybeacons+"/shortid").subscribe((resp) => {
      this.beaconsPoints= resp;
      this.storeService.localSave(this.localParam.localParam.gatewaybeacons, this.beaconsPoints);
      //console.log(this.beaconsPoints);
    }, (err) => {
      this.alert( "Error:Contacte al adminstrador del sistema");
      console.error(err);
    });
  }
  

}// fin de la class
