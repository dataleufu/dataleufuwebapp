import { Component, Input }         from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Place }                    from './place';
import { PlaceService }             from './place.service';


@Component({
  selector: 'place-form',
  templateUrl: './place-form.component.html'
})
export class PlaceComponent {
    private submitted = false;
    model = new Place(undefined, undefined, undefined, undefined, undefined, undefined);
    longitude: any;
    latitude: any;
    callback: any;

  constructor(public activeModal: NgbActiveModal, private placeService: PlaceService) {

  }

  onSubmit(): void  {
    this.submitted = true;
    this.model.point = "SRID=4326;POINT(" + this.longitude + " " + this.latitude + ")";
    this.placeService.createPlace(this.model)
      .then(place => {
        this.callback();
      });
  }
  ok(): void{
    this.activeModal.close();
  }

  disableSendButton(event:any){

  }
  imageRemoved(event:any){
    this.model.images = [];
  }
  imageUploaded(file:any){

    console.log("imageUploaded this.model.images " + this.model.images);

  }
}
