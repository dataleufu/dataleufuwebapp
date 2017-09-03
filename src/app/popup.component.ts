import { Component }         from '@angular/core';
import { PopupService }         from './popup.service';


@Component({
    selector: 'popup-component',
    template: '<div class="place_card" [hidden]="!isVisible"><h1>This is a popup.</h1></div>'
})
export class PopupComponent {
    public isVisible: boolean = false;
    constructor(private popup: PopupService) {
        console.log("PopupComponent constructor");
      popup.show.subscribe( (val:boolean) => this.isVisible = val );
    }
}
