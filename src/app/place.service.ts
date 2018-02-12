import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Place, Category, ImagePlace } from './place';
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
    return this.http.get(url)
      .toPromise()
      .then(response => {
          return response.json() as Place;}
        )
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

    return this.http
      .post(this.placesUrl, place, {headers: this.getHeaders()})
      .toPromise()
      .then(res => res.json() as Place)
      .catch(this.handleError);
  }
  update(place: Place): Promise<Place> {
    const url = `${this.placesUrl}/${place.pk}`;
    return this.http
      .put(url, place, {headers: this.getHeaders()})
      .toPromise()
      .then(res => res.json() as Place)
      .catch(this.handleError);
  }

  updateDescription(place: Place, description: string): Promise<Place> {
    const url = this.placesUrl + place.pk + "/";
    var updtedPlace = this.makeUpdatedPlace(place);
    updtedPlace.description = description;
    return this.http
      .put(url, JSON.stringify(updtedPlace), {headers: this.getHeaders()})
      .toPromise()
      .then(res => res.json() as Place)
      .catch(this.handleError);
  }

  updateCategory(place: Place, category: Category): Promise<Place> {
    const url = this.placesUrl + place.pk + "/";
    var updtedPlace = this.makeUpdatedPlace(place);
    updtedPlace.category = category;
    return this.http
      .put(url, JSON.stringify(updtedPlace), {headers: this.getHeaders()})
      .toPromise()
      .then(res => res.json() as Place)
      .catch(this.handleError);
  }

  updateImages(place: Place, images: ImagePlace[]): Promise<Place> {
    const url = this.placesUrl + place.pk + "/";
    var updtedPlace = this.makeUpdatedPlace(place);
    updtedPlace.images = images;
    return this.http
      .put(url, JSON.stringify(updtedPlace), {headers: this.getHeaders()})
      .toPromise()
      .then(res => res.json() as Place)
      .catch(this.handleError);
  }

  makeUpdatedPlace(place: Place): Place{
      return new Place(place.pk, place.description, [], null, place.point, place.category, place.owner);

  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

