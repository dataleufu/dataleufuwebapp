import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { API_BASE_URL } from './../config';
import { UserProfile, UserGroup } from './../place';

@Injectable()
export class AuthenticationService {
    public token: string;
    public user_profile: UserProfile;
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post(API_BASE_URL + '/api_login/', JSON.stringify({ username: username, password: password }), {headers: this.headers})
            .map((response: Response) => {
                let token = response.json() && response.json().token;
                this.user_profile = response.json().user_profile;
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
        .catch((error:any) => Observable.throw(false)); //...errors if any
    }

    loginWithToken(): Observable<boolean> {
        return this.http.post(API_BASE_URL + '/api_login/', JSON.stringify({ token: this.token }), {headers: this.headers})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                this.user_profile = response.json().user_profile;
                if (token) {
                    // set token property
                    this.token = token;
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: this.user_profile, token: token }));
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
        .catch((error:any) => Observable.throw(false)); //...errors if any
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        this.user_profile = null;
        localStorage.removeItem('currentUser');
    }


    create(user: UserProfile): Observable<boolean> {
        return this.http.post(API_BASE_URL + '/api_register/', user, {headers: this.headers})
            .map((response: Response) => {
                console.log("Response",response);
                let token = response.json() && response.json().token;
                this.user_profile = response.json().user_profile;
                if (token) {
                    // set token property
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: this.user_profile.user.username, token: token }));

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            })
        .catch((error:any) => Observable.throw(error.json())); //...errors if any
    }
}
