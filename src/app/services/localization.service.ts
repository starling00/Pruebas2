import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocalizationService {

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private utils: UtilsService, private http: HttpClient) { }

  // tslint:disable-next-line: ban-types
  getOffices({lat, lng}) {
    const body = {
      "latitude": lat,
      "longitude": lng
    };
    return this.http.post(this.utils.params.officeInfo, body, {headers: this.headers});
  }
}
