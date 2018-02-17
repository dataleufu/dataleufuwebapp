import {Component, OnInit } from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import {AuthenticationService } from './authentication.service';
import {UserProfile} from './../place';
import {BusyModule} from 'angular2-busy';
import {FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {RegisterComponent} from './register.component';
import {ResetPasswordComponent} from './resetPassword.component';
import {TrackerService} from "./../tracker.service";

@Component({
    templateUrl: './login.component.html',
})

export class LoginComponent implements OnInit {
    model: any = {};
    error = '';
    @Output() user = new EventEmitter<UserProfile>();
    busy: any;
    public submitted = false;
    public currentUser: UserProfile;

    constructor(
        private authenticationService: AuthenticationService,
        private fb: FacebookService,
        public activeModal: NgbActiveModal, //Modal del login
        private modalService: NgbModal,
        private tracker: TrackerService) //Modal para abrir la venta del registro
        { }

    ngOnInit() {
        this.authenticationService.logout();

        let initParams: InitParams = {
          appId: '1947080825564588',
          xfbml: true,
          version: 'v2.9'
        };

        this.fb.init(initParams);
    }


    login(): void {
        this.busy = this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(result => {
                if (result === true) {

                    this.currentUser = this.authenticationService.user_profile;
                    this.user.emit(this.authenticationService.user_profile);
                    this.submitted = true;
                    this.tracker.emitEvent("login", "login_con_usuario");

                } else {
                    this.error = 'Usuario o contraseña incorrecto.';
                }
            },
            err => {
                // Log errors if any
                console.log(err);
                this.error = 'Username or password is incorrect';
            });
    }
    close(){
        this.activeModal.close();
    }
    cancel(){
        this.user.emit(null);
    }
    register(event: any): void{
        event.preventDefault();
        this.activeModal.close();
        const modalRef  = this.modalService.open(RegisterComponent);
        modalRef.componentInstance.user.subscribe((user:UserProfile) => {
            this.user.emit(this.authenticationService.user_profile);
            this.tracker.emitEvent("registro", "registro");
        });

    }

    facebookLogin(event:any):void{
        event.preventDefault();
        this.fb.login({ scope: 'email, public_profile, user_friends', return_scopes: true }).then(
            (response: LoginResponse) => {
                status = response['status'];
                var userId = response['authResponse'].userID;
                if (status == 'connected') {
                    let access_token = response['authResponse']['accessToken'];

                    this.busy = this.authenticationService.facebookLogin(access_token)
                    .subscribe(result => {
                            this.currentUser = this.authenticationService.user_profile;
                            this.user.emit(this.authenticationService.user_profile);
                            this.submitted = true;
                            this.tracker.emitEvent("login", "login_con_facebook");
                        });

                }
            },
            (error: any) => console.error(error)
        );
    }

    resetPassword(event: any): void{
        event.preventDefault();
        this.activeModal.close();
        const modalRef  = this.modalService.open(ResetPasswordComponent);


    }

}
