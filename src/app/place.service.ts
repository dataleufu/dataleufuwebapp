import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Place } from './place';
import { API_BASE_URL } from './config';
import { AuthenticationService } from './auth/authentication.service';


@Injectable()
export class PlaceService {

  private headers = new Headers({'Content-Type': 'application/json'});

  private placesUrl = API_BASE_URL + '/api_places/';  // URL to web api

  constructor(private http: Http, private authService: AuthenticationService) {

  }

  getHeaders(): Headers{
      var token = this.authService.token;
      if (token){
          return new Headers({'Content-Type': 'application/json', 'AUTHORIZATION': 'TOKEN ' + token});
      }else{
          return new Headers({'Content-Type': 'application/json'});
      }

  }
  getPlaces(): Promise<Place[]> {
    return this.http.get(this.placesUrl)
               .toPromise()
               .then(response => response.json() as Place[])
               .catch(this.handleError);
  }


  getPlace(id: number): Promise<Place> {
    const url = `${this.placesUrl}${id}`;
    console.log("getPlace " + id);
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Place)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.placesUrl}/${id}`;
    return this.http.delete(url, {headers: this.getHeaders()})
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  create(name: string): Promise<Place> {
    return this.http
      .post(this.placesUrl, JSON.stringify({name: name}), {headers: this.getHeaders()})
      .toPromise()
      .then(res => res.json().data as Place)
      .catch(this.handleError);
  }
  createPlace(place: Place): Promise<Place> {
    console.log("create Place " + place);
    console.dir(place);
    return this.http
      .post(this.placesUrl, place, {headers: this.getHeaders()})
      .toPromise()
      .then(res => res.json() as Place)
      .catch(this.handleError);
  }
  update(place: Place): Promise<Place> {
    const url = `${this.placesUrl}/${place.pk}`;
    return this.http
      .put(url, JSON.stringify(place), {headers: this.getHeaders()})
      .toPromise()
      .then(() => place)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

