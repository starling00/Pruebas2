import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  params  = {
    officeInfo:"",
    serverurl : "",
    registerurl: "",
    loginurl:"" ,
    userurl:"",
    beaconurl:"",
    gatewayurl:"",
    asseturl:"",
    pointsurl:"",
    mapurl:"",
    uploadurl:"",
    fileurl:"",
    typesurl:"",
    schedulesurl:"",
    staffurl:"",
    counter:"",
    tbeacon:"",
    alerturl:"",
    trackerurl:"",
    delayurl:"",
    operationurl:"",
    charturl:"",
    assetsalerturl:"",
    assetshistoryurl:"",
    pacienthistoryurl:"",
    pointinfourl:"",
    pointgeneralurl:"",
    pointgeneralurlpacients:"",
    pacientspecificurl:"",
    charalertsviewsurl:"",
    charassetspointsurl:"",
    charspecificpointsurl:"",
    pointspecificurl:"" ,
    trackerhistory:"" ,
    category:"" ,
    subcategory:"" ,
    type:"",
    status:"",
    roles:"",
    permissions:"",
    priority:"",
    personalert:"",
    assetalert:"",
    heartrate:"",
    gatewaybeacons:"",
    ticketCreate:"",
    ticketServices:"",
    ticketStatus:"",
    ticketOffices:"",
    deleteTicket:"",
    postPoneTicket:"",
    userInfo:""
   };

   mapwizeParams = {
      searchdirection:""
   }
  constructor() { 
    var localizationAPI = 'http://13.59.31.150/orchestra_mapas/api/';
    // var localizationAPI = 'http://172.23.12.144/orchestra/api/';
    var newserverURL = 'http://18.224.108.194/summit/api/';
    //var ticketsURL = 'http://13.58.166.253/ficoTickets/api/';
    var ticketsURL = 'http://172.23.12.144/orchestra/api/';
    //var ticketsURL = 'http://localhost:56673/api/';
    this.params.serverurl = newserverURL;
    this.params.registerurl = newserverURL+"register";
    this.params.loginurl = newserverURL+"users/login";
    this.params.userurl = newserverURL+"users";
    this.params.beaconurl = newserverURL+"beacons";
    this.params.gatewayurl = newserverURL+"gateways";
    this.params.asseturl = newserverURL+"assets";
    this.params.mapurl = newserverURL+"maps";
    this.params.pointsurl = newserverURL+"points";
    this.params.uploadurl = newserverURL+"upload";
    this.params.fileurl = newserverURL+"files";
    this.params.typesurl = newserverURL+"types";
    this.params.schedulesurl = newserverURL+"schedules";
    this.params.staffurl = newserverURL+"people";
    this.params.counter = newserverURL+"counter";
    this.params.tbeacon = newserverURL+"tbeacon";
    this.params.alerturl = newserverURL+"alert";
    this.params.trackerurl = newserverURL+"tracker";
    this.params.delayurl = newserverURL+"delay";
    this.params.operationurl = newserverURL+"operation";
    this.params.charturl = newserverURL+"char1";
    this.params.assetsalerturl = newserverURL+"assetalert";
    this.params.assetshistoryurl = newserverURL+"assetshistory";
    this.params.pacienthistoryurl = newserverURL+"pacientshistory";
    this.params.pointinfourl = newserverURL+"pointinfo";
    this.params.pointgeneralurl = newserverURL+"pointgeneral";
    this.params.pointgeneralurlpacients = newserverURL+"pointgeneralpacient";
    this.params.pacientspecificurl = newserverURL+"/points/summary/people";
    this.params.pointspecificurl = newserverURL+"pointinfo";
    this.params.charalertsviewsurl = newserverURL+"charalertsviews";
    this.params.charassetspointsurl = newserverURL+"charassetspoints";
    this.params.charspecificpointsurl = newserverURL+"charspecificpoints";
    this.params.trackerhistory = newserverURL+"trackerhistory";
    this.params.category = newserverURL+"categories";
    this.params.subcategory = newserverURL+"subcatergories";
    this.params.type = newserverURL+"types";
    this.params.status = newserverURL+"status";
    this.params.permissions = newserverURL+"permissions";
    this.params.roles = newserverURL+"roles";
    this.params.priority = newserverURL+"priorities";
    this.params.personalert = newserverURL+"person_alert";
    this.params.assetalert = newserverURL+"asset_alert";
    this.params.heartrate = newserverURL+"heartratehistories";
    this.params.gatewaybeacons = newserverURL+"gatewaybeacons";
    var mapwizeurl = "https://api.mapwize.io/v1/";
    var apikey= "?api_key=439578d65ac560a55bb586feaa299bf7";
    this.mapwizeParams.searchdirection = mapwizeurl+ "directions"+apikey;
    this.params.officeInfo = localizationAPI+"orchestra_offices/officeslocalization";
    this.params.ticketCreate = ticketsURL+"orchestra_createTicket";
    this.params.ticketServices = ticketsURL+"orchestra_services";
    this.params.ticketStatus = ticketsURL+"orchestra_ticketStatus";
    this.params.ticketOffices = ticketsURL+"orchestra_offices";
    this.params.deleteTicket = ticketsURL+"orchestra_tickets/deleteTicket";
    this.params.postPoneTicket = ticketsURL+"orchestra_tickets/postponeTicket";
    this.params.userInfo = ticketsURL+"orchestra_userInformation";
  }//fin de bob



}//fin de class439578d65ac560a55bb586feaa299bf7
