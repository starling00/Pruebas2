import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare var google;

enum traffic {
  true = '&traffic=true',
  false = '&traffic=false'
}

enum travelMode {
  car = '&travelMode=car'
}

enum computeBestOrder {
  true = '&computeBestOrder=true',
  false = '&computeBestOrder=false'
}

enum instructionsType {
  coded = '&instructionsType=coded',
  tagged = '&instructionsType=tagged',
  text = '&instructionsType=text'
}

interface OptionsParamsQuery {
  subscriptionKey: string;
  traffic?: true | false;
  travelMode?: 'car';
  computeBestOrder?: true | false;
  routeDirectionsResult?: 'guidance';
  instructionsType?: 'coded' | 'text' | 'tagged';
  routeRepresentation?: 'polyline';
}

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private headers = new HttpHeaders({
    'Authorization': 'Basic SE5TVkNGSUNPVElDS0VUOlQxY2tldEYxYzAk'
  });

  private microsoftKey = 'D7u4dtG3OyO-S5wTY5ucRriJqXAmfO8uO20X2Kk3wl0';

  private urlApi = 'https://atlas.microsoft.com/route/directions/json?api-version=1.0&query=';

  constructor(private utils: UtilsService, private http: HttpClient, ) { }

  // tslint:disable-next-line: ban-types
  getOffices({ lat, lng }) {
    const body = {
      "latitude": lat,
      "longitude": lng
    };
    return this.http.post(`https://cservices.ficohsa.com/orchestra_offices/officeslocalization`, body, {headers: this.headers});
  }

  getRoute(routeQuery) {
    const optionsParams = this.convertParamsToQuery({
        subscriptionKey: this.microsoftKey,
        instructionsType: 'text',
        travelMode: 'car',
        traffic: true,
        computeBestOrder: true,
    });
    return this.http.get(this.urlApi + routeQuery + optionsParams );
  }

  getOffice(officeId){
    return this.http.get(`https://cservices.ficohsa.com/orchestra/orchestra_offices/servicesWaiting/{officeId}/${officeId}`, {headers: this.headers});
  }

  convertParamsToQuery(options: OptionsParamsQuery): string {
    let query = '';
    query += `&subscription-key=${options.subscriptionKey}`;
    Object.keys(options).map((value) => {
      if (value !== 'subscriptionKey') {
        query += `&${value}=${options[value]}`;
      }
    });
    return query;
  }
}
