import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ModalController, AlertController, ActionSheetController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit, AfterViewInit{
  
  mapwizeMap: any;
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    public actionSheetController: ActionSheetController,
    public platform: Platform,
    ) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
 
  }

  finalScreen(){
    if (this.platform.is('mobileweb')) {
      this.router.navigateByUrl('/login');
    }else if(this.platform.is('android')){
      navigator['app'].exitApp();
    }else{
      this.router.navigateByUrl('/login');
    }
    
  }
  link(){
    window.location.href='www.google.com';
  }
}//fin de la class
