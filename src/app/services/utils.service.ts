import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  params  = {
    officeInfo:"",
    officeQueue:"",
    ticketCreate:"",
    ticketServices:"",
    ticketStatus:"",
    allTicketsStatus:"",
    ticketOffices:"",
    deleteTicket:"",
    postPoneTicket:"",
    userInfo:"",
    getuserInfo: "",
    servicesWaiting:""
   };

   mapwizeParams = {
      searchdirection:""
   }
  constructor() { 
    // APIs production
    // var localizationAPI = 'https://cservices.ficohsa.com/';
    // APIs Development
    var localizationAPI = 'https://cdservices.ficohsa.com:9023/';

    //APIs produccion
    //var ticketsURL = 'https://cservices.ficohsa.com/';
    //APIs desarrollo
    var ticketsURL = 'https://cdservices.ficohsa.com:9023/';
    
    this.params.officeInfo = localizationAPI+"orchestra_offices/officeslocalization";
    this.params.officeQueue = localizationAPI+"orchestra/orchestra_offices/servicesWaiting/";
    this.params.ticketCreate = ticketsURL+"orchestra_createTicket/orchestra_createTicket";
    this.params.ticketServices = ticketsURL+"orchestra_services/orchestra_services";
    this.params.ticketStatus = ticketsURL+"orchestra_obtenetticketStatus/orchestra_ticketStatus";
    this.params.allTicketsStatus = ticketsURL+"orchestra_ticketStatus";
    this.params.ticketOffices = ticketsURL+"orchestra_offices";
    this.params.deleteTicket = ticketsURL+"orchestra_delete_ticket/deleteTicket";
    this.params.postPoneTicket = ticketsURL+"orchestra_postpone_tickets/postponeTicket";
    this.params.userInfo = ticketsURL+"userInformation/orchestra_userInformation";
    this.params.getuserInfo=ticketsURL+"orchestra_userInformation/orchestra_userInformation"
    this.params.servicesWaiting= ticketsURL+"orchestra/orchestra_offices/servicesWaiting/"
  }//fin de bob



}//fin de class439578d65ac560a55bb586feaa299bf7
