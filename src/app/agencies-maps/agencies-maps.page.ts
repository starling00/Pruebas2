import { Component, OnInit, ViewChild, DoCheck, } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonSlides, Platform, } from '@ionic/angular';
import { LocalizationService } from '../services/localization.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
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
  polyline = new google.maps.Polyline({
    map: null,
    strokeColor: '#1a73e8',
    visible: false
  });
  showingAgencies = false;
  watcher;

  buttonElement: HTMLElement;
  sliderElement: HTMLElement;
  

  constructor(
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    public platform: Platform,
    private service: LocalizationService,
    private router: Router
  ) {
  }

  async ngOnInit() {
    console.log('on init')
    if (this.platform.is("cordova")) {
      await this.checkGPSPermission();
      await this.getInitialPosition();
      this.loadMap();
      this.getOffices();
    }else {
      await this.getInitialPosition();
      this.loadMap();
      this.getOffices();
    }
    
  }

  ngDoCheck() {
    if (this.bestOptionsAgencies.length !== 0) {
      if (this.buttonElement === undefined || this.buttonElement === null) {
        this.buttonElement = document.getElementById('button');
        this.sliderElement = document.getElementById('slider-container');
      }
    }
  }

  async checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      async (result) => {
        if (result.hasPermission) {

          //If having permission show 'Turn On GPS' dialogue
          await this.askToTurnOnGPS();
        } else {

          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        // alert(err);
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            async () => {
              // call method to turn on GPS
              await this.askToTurnOnGPS();
              console.log('entro');
            },
            async error => {
              //Show alert if user click on 'No Thanks'
              // alert('requestPermission Error requesting location permissions ' + error)
              console.log('error al solicitar permisos');
              console.log(error);
              await this.askToTurnOnGPS();
            }
          );
      }
    });
  }

  async askToTurnOnGPS() {
    const data = await this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY);
    if(data.code == 1){
      window.location.reload();
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
      zoom: 16,
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
      const latlng = {
        lat: parseFloat(this.bestOptionsAgencies[index].latitude),
        lng: parseFloat(this.bestOptionsAgencies[index].longitude)
      };
      this.deleteMarker();
      this.infoWindow.close();
      this.setMarker(latlng);
      this.setContentToInfoWindow(index);
      this.locateOnMap(latlng);
      this.map.setZoom(16);
      this.polyline.setVisible(false);
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
    this.map.setZoom(16);
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
      <div class="info_window--info">
        <p>Direccion: ${currentCard.addressLine4}, ${currentCard.addressLine5}<br>
        Horario: Lunes - Viernes,  ${currentCard.openTime} a ${currentCard.closeTime} </p>
      </div>
      <button id="routeButton">Ruta</button>
      <button id="ticketButton">Solicitar Ticket</button>
    </div>`;
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, this.marker);
    setTimeout(() => {
      document.getElementById('routeButton').addEventListener('click', () => {
        this.showRoute({
          latitude: parseFloat(currentCard.latitude),
          longitude: parseFloat(currentCard.longitude)
        }, currentCard);
      });
      document.getElementById('ticketButton').addEventListener('click', () => { this.getTicket(); });
    }, 500);
  }

  showRoute({ latitude: lat, longitude: lng }, card) {
    const routeQuery = `${this.currentPosition.lat},${this.currentPosition.lng}:${lat},${lng}`;
    if (card.path) {
      console.log('entro sin pedir');
      this.polyline.setMap(this.map);
      this.polyline.setPath(card.path);
      this.map.fitBounds(card.bounds, { bottom: 60 });
    } else {
      console.log('entro para pedir');
      this.getRoute(routeQuery, card);
    }
    this.showAgencies();
    this.polyline.setVisible(true);
    this.infoWindow.map = null;
    this.infoWindow.close();
  }

  getRoute(routeQuery, card) {
    this.service.getRoute(routeQuery)
      .toPromise().then((data: any) => {

        const pathArray = data.routes[0].legs[0].points;
        const googleArray = new google.maps.MVCArray();
        const bounds = new google.maps.LatLngBounds();

        pathArray.forEach((point: any) => {
          const latLng = new google.maps.LatLng(point.latitude, point.longitude);
          googleArray.push(latLng);
          bounds.extend(latLng);
        });
        // -------------------------- //
        card.bounds = bounds;
        card.path = googleArray;
        console.log(card);
        this.polyline.setMap(this.map);
        this.polyline.setPath(googleArray);
        this.map.fitBounds(bounds, { bottom: 60 });
      }).catch(error => console.error(error));
  }

  getTicket() {
    this.slides.getActiveIndex().then(index => {
      const id = this.bestOptionsAgencies[index].id;
      this.locateMe();
      this.router.navigate(['/offices'], { state: { data: { id } } });
    });
  }

  getOffices() {
    this.service.getOffices(this.currentPosition).toPromise().then(res => {
      Object.keys(res).map((indice) => {
        this.bestOptionsAgencies.push(res[indice]);
        this.getServicesPerOffice(res[indice].id, indice);
        this.printDistanceMetrics(indice);
      });
    }).catch(error => console.error(error));
  }

  getServicesPerOffice(officeId, indice) {
    this.service.getOffice(officeId).toPromise().then(resp => {
      if (resp != null) {
        this.bestOptionsAgencies[indice]['servicesQueue'] = resp['areas'];
      }
    });
  }

  printDistanceMetrics(indice) {
    let distance = this.bestOptionsAgencies[indice]['distance'];
    let rounded = Math.round(distance * 1000) / 1000;
    if (distance < 1 && distance > 0) {
      rounded = rounded * 1000;
      this.bestOptionsAgencies[indice]['distance'] = rounded + 'm';
    } else if (distance >= 1) {
      rounded = Math.round(rounded);
      this.bestOptionsAgencies[indice]['distance'] = rounded + 'Km';
    }
  }

}
