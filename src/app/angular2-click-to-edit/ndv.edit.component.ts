﻿import { Component, Input, EventEmitter, ElementRef } from '@angular/core';


@Component({
    selector: 'ndv-edit',
    styles: [`
       #ndv-ic {
        margin-left: 10px;
        color: #d9d9d9;
        }

        .ndv-comp {
            padding:6px;
            border-radius: 3px;
        }
        .active-ndv {
            background-color: #f0f0f0;
            border: 1px solid #d9d9d9;
        }
        input {
            border-radius: 5px;
            box-shadow: none;
            border: 1px solid #dedede;
            min-width: 5px;
        }
        .ndv-buttons {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-top: none;
            border-radius: 0 0 3px 3px;
            box-shadow: 0 3px 6px rgba(111,111,111,0.2);
            outline: none;
            padding: 3px;
            position: absolute;
            margin-left: 6px;
            z-index: 1;
        }
        .ndv-comp:hover {
            border: 1px solid grey;
        }
        .ndv-comp:hover > ndv-ic {
            display:block;
        }

        .ndv-save {
            margin-right:3px;
        }
        .ndv-active {
            background-color: #f0f0f0;
            border: 1px solid #d9d9d9;
        }
        .ng-invalid {
                background: #ffb8b8;
            }
        .err-bubble {
            position: absolute;
            margin: 16px 100px;
            border: 1px solid red;
            font-size: 14px;
            background: #ffb8b8;
            padding: 10px;
            border-radius: 7px;
        }

    `],
    template: `<span *ngIf="!permission">{{text}}</span><span *ngIf="permission" class='ndv-comp' [ngClass]="{'ndv-active':show}">
                    <input *ngIf='show' [ngClass]="{'ng-invalid': invalid}" (ngModelChange)="validate($event)" type='text' [(ngModel)]='text' />
                    <div class='err-bubble' *ngIf="invalid">{{error || " must contain " + min + " to -" + max +" chars."}}</div>
                    <i id='ndv-ic' *ngIf='!show'>✎</i>
                    <span *ngIf='!show' (click)='makeEditable()'>{{text || '-Empty Field-'}}</span>
                </span>
                <div class='ndv-buttons' *ngIf='show'>
                    <button class='btn-x-sm' (click)='callSave()'><i>✔</i></button>
                    <button class='btn-x-sm' (click)='cancelEditable()'><i>✖</i></button>
                </div>`,
    host: {
        "(document: click)": "compareEvent($event)",
        "(click)": "trackEvent($event)"
    },
    outputs: ['save : onSave']
})

export class NdvEditComponent {
    @Input('placeholder') text;
    @Input('title') fieldName;
    originalText;
    tracker;
    el: ElementRef;
    show = false;
    save = new EventEmitter;
    @Input() permission = false;
    m: Number = 3;
    @Input() min = 0;
    @Input() max = 10000;
    @Input() error;
    @Input() regex;
    invalid = false;

    constructor(el: ElementRef) {
        this.el = el;
    }
    
    ngOnInit() {
        this.originalText = this.text;    //Saves a copy of the original field info.
    }

    validate(text) {
        if (this.regex) {
            var re = new RegExp('' + this.regex, "ig");
            if (re.test(text)) {
                this.invalid = false;
                //console.log('valid');
            }
            else {
                this.invalid = true;
            }
        }
        else {
            if ((text.length <= this.max) && (text.length >= this.min)) {
                this.invalid = false;
            }
            else {
                this.invalid = true;
            }
        }
        //console.log(this.invalid);
    }

    makeEditable() {
        if (this.show == false) {
            this.show = true;
        }
    }

    compareEvent(globalEvent) {
        if (this.tracker != globalEvent && this.show) {
            this.cancelEditable();
        }
    }

    trackEvent(newHostEvent) {
        this.tracker = newHostEvent;
    }

    cancelEditable() {
        this.show = false;
        this.invalid = false;
        this.text = this.originalText;
    }

    callSave() {
        if (!this.invalid) {
            var data = {};  //BUILD OBJ FOR EXPORT.
            data["" + this.fieldName] = this.text;
            var oldText = this.text;
            setTimeout(() => { this.originalText = oldText; this.text = oldText }, 0);  //Sets the field with the new text;
            this.save.emit(data);
            this.show = false;
        }
        
    }
}