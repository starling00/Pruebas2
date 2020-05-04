import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonSlides } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-agencies-maps',
  templateUrl: './agencies-maps.page.html',
  styleUrls: ['./agencies-maps.page.scss'],
})

export class AgenciesMapsPage implements OnInit {

  @ViewChild('slides', {static: true}) slides: IonSlides;

  map = null;
  currentPosition = {
    lat: 15.506049,
    lng: -88.028020
  };
  blueDot = null;
  bestOptionsAgencies = [
    {name: 'Lito Perez', clientes: 20, lat: 9.976337, lng: -84.839159},
    {name: 'Centro de Puntarenas', clientes: 2, lat: 9.976835, lng: -84.832266},
    {name: 'BAC Credomatic', clientes: 15, lat: 9.977691, lng: -84.828158}
  ];

  sliderConfig={
    spaceBetween:10,
    centeredSlides:true,
    slidesPerView: 1.8
  }

  constructor(private geolocation: Geolocation) { }

  async ngOnInit() {
    await this.getInitialPosition();
    this.loadMap();
  }

  async getInitialPosition() {
    const coords = (await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 1000 })).coords;
    this.currentPosition = {
      lat: coords.latitude,
      lng: coords.longitude
    }
  }

  watchPosition() {
    this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe(resp => {
      this.currentPosition = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.blueDot.setPosition(this.currentPosition);
    });
  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapElement: HTMLElement = document.getElementById('map');
    // create map
    this.map = new google.maps.Map(mapElement, {
      center: this.currentPosition,
      zoom: 17,
      disableDefaultUI: true,
      zoomControl: false,
      scaleControl: false,
    });

    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapElement.classList.add('show-map');
    });

    this.blueDot = new google.maps.Marker({
      position: this.currentPosition,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#1A73E8',
        fillOpacity: 1.0,
        strokeColor: '#1A73E8',
        strokeOpacity: 0.5,
      },
      draggable: true,
      map: this.map
    });

    this.watchPosition();
  }

  slideChanged(){
    this.slides.getActiveIndex().then(data=>{
      console.log(data)
    })
  }


}
