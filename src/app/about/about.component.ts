
import {Component, Input} from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-content2',
  templateUrl: './app/about.component.html'
})
export class AboutComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
