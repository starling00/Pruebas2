import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilStorageService {
  localParam = {
    userLogged:"",
    alerts:"",
    alertsId:"",
  }

  constructor() { 
    this.localParam.userLogged = "user-logged";
    this.localParam.alerts = "alert-amount";
    this.localParam.alertsId = "alerts-id";
  }
}