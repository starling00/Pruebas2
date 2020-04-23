import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-generate-meeting',
  templateUrl: './generate-meeting.component.html',
  styleUrls: ['./generate-meeting.component.scss'],
})
export class GenerateMeetingComponent implements OnInit, AfterViewInit {

  referenceNumber: any;
  meetingData: any;

  constructor(
    private router: Router,
    private params: UtilsService,
    private service: CrudService,
    private storeService: StorageService,
    private localParam: UtilStorageService, 
    public menuCtrl: MenuController) {
       
      this.menuCtrl.enable(false);
  }

  ngOnInit() {

  }

  ngAfterViewInit(){
    
  }

  generateMeeting(){
    //Hacer el api del get de la cita
    let position = 0;
    let value = this.referenceNumber;
    while (value.charAt(position) == "0") {
      position++;
    }
    let refNumber = this.referenceNumber.substr(position, value.length - 4 - position);

    this.service.get('http://localhost:56673/api/orchestra_offices/meeting/'+refNumber).subscribe((resp) => {
      this.meetingData = resp;
      this.storeService.localSave(this.localParam.localParam.meetingData, this.meetingData);
      console.log(this.meetingData);
      this.router.navigateByUrl('/meeting');
    }, (err) => {
      console.error(err);
    });
  }

}
