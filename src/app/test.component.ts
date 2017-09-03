import { Component }         from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core'

@Component({
    selector: 'test',
    template: `
    <h1 (click)="output.next('output')"  class="place_card">Alert {{type}}</h1>
    `
})
export class TestComponent {

    @Input() type: string = "success";
    @Output() output = new EventEmitter();
    @Output() test: string = "testString";

    constructor() {
        console.log("TestComponent constructor");
        this.test = "testStringConstructor";
    }
}
