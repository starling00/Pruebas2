import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

export interface iStorage {
  saveData();
  alertAmount();
}

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  data: any;

  constructor(private storage: Storage, private router: Router) {

  }

  setData(data) {
    this.data = data;
  }

  getData(){
    return this.data;
  }

  localSave(key, data: any): void {
    this.storage.ready().then(() => {
      this.storage.set(key, data);
      //console.log(data);
    },(err) => {
      this.storage.clear();
      this.router.navigateByUrl('/login');
      console.error(err);
    });
  }

  localGet(key){
    if(key){
      return this.storage.get(key);
    }
    else{
      this.storage.clear();
      this.router.navigateByUrl('/login');
    }
  }
}
