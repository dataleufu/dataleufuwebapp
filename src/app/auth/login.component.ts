import { Component, OnInit } from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {BusyModule}              from 'angular2-busy';
import {UserProfile} from './../place';


@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    error = '';
    @Output() user = new EventEmitter<UserProfile>();
    busy: any;

    constructor(
        private authenticationService: AuthenticationService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();
    }

    login() {
        this.busy = this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
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
}
