import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonSlides, Platform } from '@ionic/angular';

declare var google;

@Component({
  selector: 'app-agencies-maps',
  templateUrl: './agencies-maps.page.html',
  styleUrls: ['./agencies-maps.page.scss'],
})

export class AgenciesMapsPage implements OnInit {

  @ViewChild('slides', { static: true }) slides: IonSlides;

  map = null;
  currentPosition = {
    lat: 15.506049,
    lng: -88.028020
  };
  blueDot = null;
  bestOptionsAgencies = [
    { name: 'Lito Perez', clientes: 20, lat: 9.976337, lng: -84.839159 },
    { name: 'Centro de Puntarenas', clientes: 2, lat: 9.976835, lng: -84.832266 },
    { name: 'BAC Credomatic', clientes: 15, lat: 9.977691, lng: -84.828158 }
  ];
  sliderConfig = {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 1.4
  };
  marker = new google.maps.Marker({
    position: null,
    draggable: false,
    map: null,
    animation: google.maps.Animation.DROP,
  });
  infoWindow = new google.maps.InfoWindow({
    content: null,
  });
  showingAgencies = false;


  constructor(private geolocation: Geolocation, public platform: Platform) {
    if (platform.width() >= 800) {
      this.sliderConfig.slidesPerView = 2.4;
      this.sliderConfig.spaceBetween = 20;
    }
  }

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
      disableDoubleClickZoom: true,
      zoomControl: false,
      scrollwheel: false,
      scaleControl: false,
      keyboardShortcuts: false,
      clickableIcons: false,
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
      draggable: false,
      map: this.map
    });

    this.watchPosition();
  }

  slideChanged() {
    this.slides.getActiveIndex().then(index => {
      const latlng = { lat: this.bestOptionsAgencies[index].lat, lng: this.bestOptionsAgencies[index].lng };
      this.deleteMarker();
      this.infoWindow.close();
      this.setMarker(latlng);
      this.setContentToInfoWindow(latlng);
      this.locateOnMap(latlng);
    });
  }

  setMarker(position) {
    this.marker.setPosition(position);
    this.marker.setAnimation(google.maps.Animation.DROP);
    this.marker.setMap(this.map);
  }

  deleteMarker() {
    this.marker.setMap(null);
  }

  locateOnMap(position) {
    this.map.panTo(position);
  }

  showAgencies(event) {
    this.showingAgencies = !this.showingAgencies;
    const container: HTMLElement = document.getElementById('slider-container');
    event.target.classList.toggle('slide-fwd-top');
    event.target.classList.toggle('slide-bck-bottom');
    container.classList.toggle('scale-down-ver-bottom');
    container.classList.toggle('scale-up-ver-bottom');
    if (this.showingAgencies) {
      this.slideChanged();
    } else {
      this.deleteMarker();
      this.locateOnMap(this.currentPosition);
    }
  }

  setContentToInfoWindow(position) {
    const content = `
    <div class="info_window">
      <img src="https://www.larepublica.net/storage/images/2019/12/11/20191211142642.hangar-plazas.jpg" class="info_window--img">
      <div class="info_window--info">
        <h6>nombre de la agencia</h6>
        <p>Direccion: hola mundo, Honduras</p>
        <p>Telefono: +88 8888 8888</p>
        <p>Distancia: 20km</p>
      </div>
    </div>`;
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, this.marker);
  }

  animationTextChange(){

  }

}
