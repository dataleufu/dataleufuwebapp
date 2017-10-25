import { Component } from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import { AuthenticationService } from './authentication.service';
import {UserProfile} from './../place';
import {BusyModule} from 'angular2-busy';


@Component({
    templateUrl: './register.component.html',
})

export class RegisterComponent {
    model: any = {};
    error: any = {};
    busy: any;

    @Output() user = new EventEmitter<UserProfile>();
    public submitted = false;

    constructor(
         private authenticationService: AuthenticationService) { }


    register(): any {
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
