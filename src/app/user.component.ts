import { Component, OnInit }         from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core'
import { INITIAL_ROTATION_DURATION } from './config';
import { AuthenticationService } from './auth/authentication.service';
import { UserProfile } from './place';
import {LoginComponent} from './auth/login.component';

import {RegisterComponent} from './auth/register.component';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

declare var Cesium : any;


@Component({
    selector: 'user',
    templateUrl: './user.component.html',

})
export class UserComponent implements OnInit{

    collapsed: boolean = false;
    @Output() user = new EventEmitter<UserProfile>();
    public currentUser: UserProfile;
    @Input() viewer: any;

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
    goHome(event: any): void{
        event.preventDefault();
        var camera = this.viewer.scene.camera;
        camera.flyHome();
    }
    gotoMyLocation(event: any): void{
        event.preventDefault();
        var that = this;
        // Create callback for browser's geolocation
        function fly(position: any) {
            that.viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 1000.0)
            });
        }

        // Ask browser for location, and fly there.
        navigator.geolocation.getCurrentPosition(fly, this.showErrors);
    }
    showErrors(error: any){
         console.warn('ERROR(' + error.code + '): ' + error.message);
         //Todo: mensajes al usuario (como servicio)
    }
}
