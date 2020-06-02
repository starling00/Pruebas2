import { Component, OnInit } from '@angular/core';
import {PopoverController, ModalController} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.page.html',
  styleUrls: ['./terms-conditions.page.scss'],
})
export class TermsConditionsPage implements OnInit {

  constructor(private popover: PopoverController,
    private router: Router,
    public modalController: ModalController) { }

  ngOnInit() {
  }

ClosePopover(){
  this.popover.dismiss();
}
dismiss() {
  // using the injected ModalController this page
  // can "dismiss" itself and optionally pass back data
  this.modalController.dismiss({
    'dismissed': true
  });
}
login() {
 // this.ClosePopover();
 
  this.router.navigateByUrl('/login');
  this.dismiss();
}

}//fin de la clase
