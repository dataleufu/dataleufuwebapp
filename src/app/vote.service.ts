import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Place, Category, ImagePlace } from './place';
import { API_BASE_URL, ANONYMOUS_TOKEN } from './config';
import { AuthenticationService } from './auth/authentication.service';


@Injectable()
export class VoteService {

  private headers = new Headers({'Content-Type': 'application/json'});

  private baseUrl = API_BASE_URL + '/votes/';  // URL to web api

  constructor(private http: Http, private authService: AuthenticationService) {

  }

  getReadHeaders(): Headers{
      var token = this.authService.token;
      if (token){
          return new Headers({'Content-Type': 'application/json', 'AUTHORIZATION': 'TOKEN ' + token});
      }else{
          return new Headers({'Content-Type': 'application/json', 'AUTHORIZATION': 'TOKEN ' + ANONYMOUS_TOKEN});
      }

  }
  getWriteHeaders(): Headers{
      var token = this.authService.token;
      if (token){
          return new Headers({'Content-Type': 'application/json', 'AUTHORIZATION': 'TOKEN ' + token});
      }else{
          return new Headers({'Content-Type': 'application/json'});
      }

  }
  getVotes(placeId: number): Promise<any> {
    return this.http.get(this.baseUrl + 'count/?model=place&id=' + placeId, {headers: this.getReadHeaders()})
               .toPromise()
               .then(response => response.json() as number)
               .catch(this.handleError);
  }

  vote(placeId: number): Promise<boolean> {
    var params = { model: 'places', id: placeId, 'vote': true};
    return this.http
      .post(this.baseUrl + 'up/?vote=true&model=place&id=' + placeId, JSON.stringify(params), {headers: this.getWriteHeaders()})
      .toPromise()
      .then(res => true)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

