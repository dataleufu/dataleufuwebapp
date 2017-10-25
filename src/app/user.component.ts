import { Component, OnInit }         from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core'
import { INITIAL_ROTATION_DURATION } from './config';
import { AuthenticationService } from './auth/authentication.service';
import { UserProfile } from './place';
import {LoginComponent} from './auth/login.component';

import {RegisterComponent} from './auth/register.component';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',

})
export class UserComponent implements OnInit{

    collapsed: boolean = false;
    @Output() user = new EventEmitter<UserProfile>();
    public currentUser: UserProfile;

    constructor(private authenticationService: AuthenticationService,
        private modalService: NgbModal,) { console.log("UserComponent constructor");}

    ngOnInit() {
        this.tryLogin();
    }

    collapseUser(event: any){
        event.preventDefault();
        this.collapsed = !this.collapsed;
    }

    login(event: any): void{
        event.preventDefault();
        const modalRef  = this.modalService.open(LoginComponent);
        modalRef.componentInstance.user.subscribe((user:UserProfile) => {
            this.setUser(user);
            modalRef.close();
        });

    }
    tryLogin(): void{
      this.authenticationService.loginWithToken()
            .subscribe(result => {
                if (result === true) {
                    this.setUser(this.authenticationService.user_profile);
                } else {
                    this.setUser(null);
                }
            },
            err => {
                this.setUser(null);
            }
           );
    }

    logout(event: any): void{
        event.preventDefault();
        this.authenticationService.logout();
        this.setUser(null);
    }

    setUser(user: UserProfile){
        this.user.emit(user);
        this.currentUser = user;
    }

    register(event: any): void{
        event.preventDefault();
        const modalRef  = this.modalService.open(RegisterComponent);
        modalRef.componentInstance.user.subscribe((user:UserProfile) => {
            this.setUser(user);
            modalRef.close();
        });

    }
}
