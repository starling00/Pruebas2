import { Component, OnInit, ViewChild, DoCheck, } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonSlides, Platform, } from '@ionic/angular';
import { LocalizationService } from '../services/localization.service';
import { Router } from '@angular/router';

declare var google;

@Component({
  selector: 'app-agencies-maps',
  templateUrl: './agencies-maps.page.html',
  styleUrls: ['./agencies-maps.page.scss'],
})

export class AgenciesMapsPage implements OnInit, DoCheck {

  @ViewChild('slides', { static: true }) slides: IonSlides;

  map = null;
  currentPosition = {
    lat: 15.506049,
    lng: -88.028020
  };
  blueDot = null;
  bestOptionsAgencies = [];
  marker = new google.maps.Marker({
    position: null,
    draggable: false,
    map: null,
    animation: google.maps.Animation.DROP,
  });
  infoWindow = new google.maps.InfoWindow({
    content: null,
  });
  polyline = new google.maps.Polyline({map: null});
  showingAgencies = false;
  watcher;

  buttonElement: HTMLElement;
  sliderElement: HTMLElement;

  constructor(
    private geolocation: Geolocation,
    public platform: Platform,
    private service: LocalizationService,
    private router: Router
    ) {
  }

  async ngOnInit() {
    await this.getInitialPosition();
    this.loadMap();
    this.getOffices();
  }

  ngDoCheck() {
    if (this.bestOptionsAgencies.length !== 0) {
      if (this.buttonElement === undefined || this.buttonElement === null) {
        this.buttonElement = document.getElementById('button');
        this.sliderElement = document.getElementById('slider-container');
      }
    }
  }

  async getInitialPosition() {
    const coords = (await this.geolocation.getCurrentPosition({ enableHighAccuracy: true, maximumAge: 1000 })).coords;
    this.currentPosition = {
      lat: coords.latitude,
      lng: coords.longitude
    };
  }

  watchPosition() {
    this.watcher = this.geolocation.watchPosition({ enableHighAccuracy: true }).subscribe(resp => {
      this.currentPosition = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.blueDot.setPosition(this.currentPosition);
    });
  }

  ionViewWillLeave() {
    this.watcher.unsubscribe();
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
      scrollwheel: true,
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

    this.map.addListener('drag', () => {
      if (this.infoWindow.map != null) {
        this.showAgencies();
        this.infoWindow.close();
      } else if (this.showingAgencies) {
        this.showAgencies();
      }
    });
  }

  sliderConfig() {
    if (window.innerWidth >= 1400) {
      return {
        spaceBetween: 20,
        slidesPerView: 3.4,
        centeredSlides: true
      };
    } else if (window.innerWidth >= 860 && window.innerWidth < 1400) {
      return {
        spaceBetween: 10,
        slidesPerView: 2.4,
        centeredSlides: true
      };
    } else {
      return {
        spaceBetween: 10,
        slidesPerView: 1.4,
        centeredSlides: true
      };
    }
  }

  slideChanged() {
    this.slides.getActiveIndex().then(index => {
      const latlng = { lat: this.bestOptionsAgencies[index].latitude, lng: this.bestOptionsAgencies[index].longitude };
      this.deleteMarker();
      this.infoWindow.close();
      this.setMarker(latlng);
      this.setContentToInfoWindow(index);
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

  locateMe() {
    this.map.panTo(this.currentPosition);
    this.map.setZoom(17);
    this.showingAgencies = false;
    this.buttonElement.classList.remove('slide-fwd-top');
    this.buttonElement.classList.add('slide-bck-bottom');
    this.sliderElement.classList.remove('scale-up-ver-bottom');
    this.sliderElement.classList.add('scale-down-ver-bottom');
    if (this.infoWindow.map != null) {
      this.infoWindow.close();
    }
  }

  toggleButton() {
    this.buttonElement.classList.toggle('slide-fwd-top');
    this.buttonElement.classList.toggle('slide-bck-bottom');
  }

  toggleAgencies() {
    this.sliderElement.classList.toggle('scale-down-ver-bottom');
    this.sliderElement.classList.toggle('scale-up-ver-bottom');
  }

  showAgencies() {
    this.showingAgencies = !this.showingAgencies;
    this.toggleButton();
    this.toggleAgencies();
    if (this.showingAgencies) {
      this.slideChanged();
    }
  }

  setContentToInfoWindow(slideIndex) {
    const currentCard = this.bestOptionsAgencies[slideIndex];
    const content = `
    <div class="info_window">
      <img src="https://www.larepublica.net/storage/images/2019/12/11/20191211142642.hangar-plazas.jpg" class="info_window--img">
      <div class="info_window--info">
        <p>Direccion: ${currentCard.address1}, ${currentCard.city}</p>
        <p>Telefono: +88 8888 8888</p>
        <p>algun dato</p>
      </div>
      <button id="routeButton">Ruta</button>
      <button id="ticketButton">Solicitar Ticket</button>
    </div>`;
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, this.marker);
    setTimeout(() => {
      document.getElementById('routeButton').addEventListener('click', () => { this.getRoute(); });
      document.getElementById('ticketButton').addEventListener('click', () => { this.getTicket(); });
    }, 500);
  }

  getRoute(agenciePosition = {lat: 9.976813, lng: -84.836160}) {
    const routeQuery = `${this.currentPosition.lat},${this.currentPosition.lng}:${agenciePosition.lat},${agenciePosition.lng}`;
    this.service.getRoute(routeQuery)
    .toPromise().then( (data: any) => {
      const bounds = new google.maps.LatLngBounds();
      const googleArray = new google.maps.MVCArray();
      const pathArray = data.routes[0].legs[0].points;
      pathArray.forEach((point: any) => {
        const latLng = new google.maps.LatLng(point.latitude, point.longitude);
        googleArray.push(latLng);
        bounds.extend(latLng);
      });
      this.polyline.setMap(this.map);
      this.polyline.setPath(googleArray);
      this.map.fitBounds(bounds);
    }).catch(error => console.error(error));
  }

  getTicket() {
    this.slides.getActiveIndex().then(index => {
      const id = this.bestOptionsAgencies[index].id;
      this.router.navigate(['/offices'], { state: { data: { id } } });
    });
    // console.log('entra al get ticket');

  }

  getOffices() {
    this.service.getOffices(this.currentPosition).toPromise().then(res => {
      Object.keys(res).map((indice) => {
        this.bestOptionsAgencies.push(res[indice]);
      });
      console.log(this.bestOptionsAgencies);
    });
  }

}
