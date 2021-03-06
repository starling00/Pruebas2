import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilStorageService {
  localParam = {
    userLogged:"",
    userName:"",
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
    officeName:"",
    ticketDate:"",
    crossSelling:"",
  }

  constructor() { 
    this.localParam.userLogged = "user-logged";
    this.localParam.userName = "user-name";
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
    this.localParam.officeName = "office-name";
    this.localParam.ticketDate = "ticket-date";
    this.localParam.crossSelling = "cross-Selling";
  }
}
