import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Category } from './place';

@Injectable()
export class CategoryService {

  private headers = new Headers({'Content-Type': 'application/json'});

  private apiUrl = 'http://mexico.q123.com.ar:8000/api_categories/';  // URL to web api

  constructor(private http: Http) { }

  getCategories(): Promise<Category[]> {
    console.log("CategoryService getCategories ");
    return this.http.get(this.apiUrl)
               .toPromise()
               .then(response => response.json().results as Category[])
               .catch(this.handleError);
  }

  getCategory(id: number): Promise<Category> {
    const url = `${this.apiUrl}${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json() as Category)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

