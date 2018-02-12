import { Component, OnInit } from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable }    from '@angular/core';

@Component({

    templateUrl: './loginRequired.component.html',
})


export class LoginRequiredComponent implements OnInit {
    @Input() message: string;
    @Output() doLogin = new EventEmitter<any>();

    constructor(public activeModal: NgbActiveModal,  private modalService: NgbModal,) { }

    ngOnInit() {}

    login(): void{
        this.doLogin.emit();
        this.activeModal.close();
    }

    cancel(): void{
        this.activeModal.close();
    }

}
