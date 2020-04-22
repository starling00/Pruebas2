import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { IBeacon } from '@ionic-native/ibeacon/ngx';
import { CrudService } from '../services/crud.service';
import { StorageService } from '../services/storage.service';
import { UtilStorageService } from '../services/util-storage.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-heartrate',
  templateUrl: './heartrate.component.html',
  styleUrls: ['./heartrate.component.scss'],
})
export class HeartrateComponent implements OnInit, AfterViewInit {

  ticketStatus: any;
  createdTicket: any;
  ticketServices: any;
  serviceId: any;
  generatedServices: any;
  urlId: any;

  pages=[
    { title: 'Home',
  url:'/menu/third'
  },];
  interval: any;
  view: any[] = [400, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = '';
  showYAxisLabel = false;
  yAxisLabel = '';
  timeline = false;
  yScaleMax=80;
  yScaleMin = 50;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  multi: any[] = [
    {
      name: 'Ritmo',
      series: [{
        name: 5,
        value: 60
      }]
    }
  ];;

setData() {
  this.multi = [
    {
      name: 'Ritmo',
      series: [
        {
          name: "10:00",
          value: 60
        },
        {
          name: "10:05",
          value: 80
        },
        {
          name: "10:10",
          value: 50
        },
        {
          name: "10:15",
          value: 75
        },
        {
          name: "10:20",
          value: 70
        },
      ]
    }
  ];
}
timer() {
  this.interval = setInterval(() => {
    this.getHeartData();
  }, 20000);
}
getHeartData(){
  this.service.get(this.params.params.heartrate+"/lastest/").subscribe((resp:any[]) => {
    var data =  {
      name: "10:00",
      value: 70
    };
    this.multi[0].series.push(data);
  }, (err) => {
    console.error(err);
  });
}

  constructor( private router: Router,  private params: UtilsService,
    private service: CrudService,
    private storeService: StorageService,
    private localParam: UtilStorageService, 
    public menuCtrl: MenuController,
    private route: ActivatedRoute) { 
      this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.urlId = this.route.snapshot.paramMap.get("id");
    //this.getHeartData();
    //this.timer();
    //this.getServices();
    
  }

  ngAfterViewInit(){
    this.GenerateServices();
  }

  GenerateServices(){
    this.service.saveTicket(this.params.params.ticketServices+'/'+this.urlId, null).subscribe((resp) => {
      this.ticketServices = resp;
      this.storeService.localSave(this.localParam.localParam.ticketServices, this.ticketServices);

      console.log(this.ticketServices);
    }, (err) => {
      console.error(err);
    });
  }

  go(id) {
    this.createTicket(id);
    this.router.navigateByUrl('/menu/first/tabs/tab2');
  }

  getTicketStatus(visitId){
    this.service.get(this.params.params.ticketStatus+'/'+visitId).subscribe((resp) => {
      this.ticketStatus = resp;
      this.storeService.localSave(this.localParam.localParam.ticketStatus, this.ticketStatus);

      console.log(this.ticketStatus);
    }, (err) => {
      console.error(err);
    });
  }

  createTicket(id){
    this.service.saveTicket(this.params.params.ticketCreate+'/serviceId/'+id+'/officeId/'+this.urlId, null).subscribe((resp) => {
      this.createdTicket = resp;
      this.storeService.localSave(this.localParam.localParam.createdTicket, this.createdTicket);

      this.getTicketStatus(this.createdTicket.visitId);
      console.log(this.createdTicket);
    }, (err) => {
      console.error(err);
    });
  }

  getServices(){
    this.storeService.localGet(this.localParam.localParam.ticketServices).then((resp) => {
      this.ticketServices = resp;

      console.log(this.ticketServices);
    }, (err) => {
      console.error(err);
    });
  }

}
