import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilStorageService {
  localParam = {
    userLogged:"",
    alerts:"",
    alertsId:"",
    gatewaybeacons:"",
    lastBeacon:"",
    createdTicket:"",
    ticketStatus:"",
    ticketServices:"",
    ticketOffice:"",
    meetingData:"",
    userModel:"",
  }

  constructor() { 
    this.localParam.userLogged = "user-logged";
    this.localParam.alerts = "alert-amount";
    this.localParam.alertsId = "alerts-id";
    this.localParam.gatewaybeacons = "gatewaybeacons";
    this.localParam.lastBeacon = "last-beacon";
    this.localParam.createdTicket = "created-ticket";
    this.localParam.ticketStatus = "ticket-status";
    this.localParam.ticketServices = "ticket-services";
    this.localParam.ticketOffice = "ticket-office";
    this.localParam.meetingData = "meeting-data";
    this.localParam.userModel = "user-model";
  }
}
