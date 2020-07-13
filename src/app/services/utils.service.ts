import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  params  = {
    officeInfo:"",
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
    //var ticketsURL = 'http://13.58.166.253/ficoTickets/api/';
    var ticketsURL = 'http://172.23.12.144/orchestra/api/';
    
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
