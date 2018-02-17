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
        //var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = localStorage.getItem('token');
        this.user_profile = JSON.parse(localStorage.getItem('user_profile'));
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post(API_BASE_URL + '/rest-auth/login/', JSON.stringify({ username: username, password: password }),
            {headers: this.headers})
            .map((response: Response) => {
                let token = response.json() && response.json().key;
                let user_profile = response.json() && response.json().user_profile;
                if (token) {
                    this.setToken(token);
                    this.setUserProfile(user_profile);
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
                let user_profile = response.json() && response.json().user_profile;
                if (token) {
                    this.setToken(token);
                    this.setUserProfile(user_profile);
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
        localStorage.removeItem('user_profile');
        localStorage.removeItem('token');
    }

    facebookLogin(access_token: string): Observable<boolean> {
        let params = {'access_token': access_token};
        return this.http.post(API_BASE_URL + '/rest-auth/facebook/', params, {headers: this.headers})
            .map((response: Response) => {
                let token = response.json() && response.json().key;
                let user_profile = response.json() && response.json().user_profile;
                this.setToken(token);
                this.setUserProfile(user_profile);
                return true;

            })
         .catch((error:any) => Observable.throw(error.json())); //...errors if any
    }
    setToken(token: string): void{
        this.token = token;
        localStorage.setItem('token', token);

    }
    setUserProfile(user_profile: UserProfile): void{
        this.user_profile = user_profile;
        localStorage.setItem('user_profile', JSON.stringify({ user_profile: this.user_profile }));
    }
    create(user: any): Observable<boolean> {
        let params = {username: user.username,
            password1: user.password,
            password2: user.password,
            email: user.email};
        return this.http.post(API_BASE_URL + '/rest-auth/registration/', params, {headers: this.headers})
            .map((response: Response) => {
                let token = response.json() && response.json().key;
                let user_profile = response.json() && response.json().user_profile;
                if (token) {
                    this.setToken(token);
                    this.setUserProfile(user_profile);
                        // return true to indicate successful login
                    return true;

                } else {
                    // return false to indicate failed login
                    return false;
                }


            })
        .catch((error:any) => {
            return Observable.throw(error.json())

        }); //...errors if any
    }

    resetPassword(mail: string): Observable<boolean> {

        return this.http.post(API_BASE_URL + '/rest-auth/password/reset/', mail, {headers: this.headers})
            .map((response: Response) => {
                return true;
            })
        .catch((error:any) => Observable.throw(error.json())); //...errors if any
    }
}
