import { Component, OnInit } from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core';
import {BusyModule}              from 'angular2-busy';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable }    from '@angular/core';

@Component({
    moduleId: module.id,
    templateUrl: 'message.component.html'
})


export class MessageComponent implements OnInit {
    @Input() message: string;


    constructor(public activeModal: NgbActiveModal,  private modalService: NgbModal,) { }

    ngOnInit() {

    }


    cancel(): void{
        this.activeModal.close();
    }

}
