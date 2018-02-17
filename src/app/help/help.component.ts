
import {Component, Input} from '@angular/core';

import {NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-modal-help',
  templateUrl: './help.component.html'
})
export class HelpComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
