import { Component, OnInit } from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {UserProfile} from './../place';
import {BusyModule} from 'angular2-busy';
import { FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RegisterComponent} from './register.component';

@Component({
    templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
    model: any = {};
    error = '';
    @Output() user = new EventEmitter<UserProfile>();
    busy: any;

    constructor(
        private authenticationService: AuthenticationService,
        private fb: FacebookService,
        private modalService: NgbModal) { }

    ngOnInit() {
        // reset login status
        console.log("LoginComponent ngOnInit");
        this.authenticationService.logout();

        let initParams: InitParams = {
          appId: '1947080825564588',
          xfbml: true,
          version: 'v2.8'
        };

        this.fb.init(initParams);
    }


    login(): void {
        this.busy = this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                console.log("Login controller result " + result);
                console.dir(result);
                if (result === true) {
                   this.user.emit(this.authenticationService.user_profile);

                } else {
                    this.error = 'Username or password is incorrect';
                }
            },
            err => {
                // Log errors if any
                console.log(err);
                this.error = 'Username or password is incorrect';
            });
    }
    cancel(){
        this.user.emit(null);
    }
    register(event: any): void{
        event.preventDefault();
        this.user.emit(null);
        const modalRef  = this.modalService.open(RegisterComponent);
        modalRef.componentInstance.user.subscribe((user:UserProfile) => {
            this.user.emit(this.authenticationService.user_profile);
            modalRef.close();
        });

    }

    facebookLogin(event:any):void{
        console.log("LoginComponent facebookLogin");
        event.preventDefault();
        this.fb.login({ scope: 'email, public_profile, user_friends', return_scopes: true }).then(
            (response: LoginResponse) => {
                status = response['status'];
                console.log("status", status);
                var userId = response['authResponse'].userID;
                if (status == 'connected') {
                    let access_token = response['authResponse']['accessToken'];

                    localStorage.setItem('id_token', access_token);
                    console.log("access_token " + access_token);
                    this.busy = this.authenticationService.facebookLogin(access_token)
                    .subscribe(result => {
                            console.log("facebookLogin result" + result);
                            console.dir(result);
                            this.user.emit(this.authenticationService.user_profile);
                            console.log("facebookLogin emit" + this.authenticationService.user_profile);
                        });

                }
            },
            (error: any) => console.error(error)
        );
    }
}
