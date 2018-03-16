import {Component, OnInit }         from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core'
import {INITIAL_ROTATION_DURATION } from './config';
import {AuthenticationService } from './auth/authentication.service';
import {UserProfile } from './place';
import {LoginComponent} from './auth/login.component';
import {RegisterComponent} from './auth/register.component';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {TrackerService} from "./tracker.service";
import { MessageComponent }         from './message.component';

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
        private modalService: NgbModal,
        private tracker: TrackerService) {}

    ngOnInit() {
        this.tryLogin();
    }

    collapseUser(event: any){
        event.preventDefault();
        this.collapsed = !this.collapsed;
        if (this.collapsed)
            this.tracker.emitEvent("usuario", "desplegar_usuario");
        else
            this.tracker.emitEvent("usuario", "ocultar_usuario");
    }

    login(event: any): void{
        if (event)
            event.preventDefault();
        const modalRef  = this.modalService.open(LoginComponent);
        modalRef.componentInstance.user.subscribe((user:UserProfile) => {
            this.setUser(user);
        });

    }
    tryLogin(): void{
      this.authenticationService.loginWithToken()
            .subscribe(result => {
                if (result === true) {
                    this.setUser(this.authenticationService.user_profile);
                    this.tracker.emitEvent("login", "login_con_token");
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
        this.tracker.emitEvent("logout", "logout");
    }

    setUser(user: UserProfile){
        this.user.emit(user);
        this.currentUser = user;
    }


    goHome(event: any): void{
        event.preventDefault();
        var camera = this.viewer.scene.camera;
        camera.flyHome();
        this.tracker.emitEvent("menu", "volar_al_inicio");
    }


    /*gotoMyLocation(event: any): void{
        event.preventDefault();
        this.tracker.emitEvent("menu", "volar_a_mi_ubicacion");
        var that = this;
        // Create callback for browser's geolocation
        function fly(position: any) {
            that.viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 1000.0)
            });
        }
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(fly, function (error: any){
                 var text = "No es posible acceder a tu ubicación. El navegador no soporta geolocalización";
                 const modalRef = that.modalService.open(MessageComponent);
                 modalRef.componentInstance.message = text;
            });
        } else {
            this.showMyLocationError(null);
            that.tracker.emitEvent("menu", "volar_a_mi_ubicacion_no_permitido");
        }

    }
    showMyLocationError(error: any){
        var text = "No es posible acceder a tu ubicación. El navegador no soporta geolocalización";
        const modalRef = this.modalService.open(MessageComponent);
        modalRef.componentInstance.message = text;
    }*/
}
