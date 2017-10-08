import { Component } from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {BusyModule}              from 'angular2-busy';
import {UserProfile} from './../place';

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    error: any = {};
    busy: any;

    @Output() user = new EventEmitter<UserProfile>();
    private submitted = false;

    constructor(
         private authenticationService: AuthenticationService) { }

    register() {
       this.busy = this.authenticationService.create(this.model)
            .subscribe(
                data => {

                     this.submitted = true;
                },
                error => {
                    this.error = error;
                });
    }
    cancel(){
        this.user.emit(null);
    }
    close(){
        this.user.emit(this.authenticationService.user_profile);
    }

}
