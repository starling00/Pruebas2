import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google;

@Component({
  selector: 'app-agencies-maps',
  templateUrl: './agencies-maps.page.html',
  styleUrls: ['./agencies-maps.page.scss'],
})
export class AgenciesMapsPage implements OnInit {

  map = null;

  constructor(private geolocation: Geolocation) {}

  ngOnInit() {
    this.loadMap();
    this.getCurrentPosition();
  }

  getCurrentPosition(){
    this.geolocation.getCurrentPosition({enableHighAccuracy:true, maximumAge:1000}).then((resp)=>{
      console.log(resp);
    }).catch((error)=>{
      console.log(error)
    });
  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapElement: HTMLElement = document.getElementById('map');
    // create LatLng object
    const myLatLng = {lat: 4.658383846282959, lng: -74.09394073486328};
    // create map
    this.map = new google.maps.Map(mapElement, {
      center: myLatLng,
      zoom: 12
    });
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapElement.classList.add('show-map');
    });
  }

}
