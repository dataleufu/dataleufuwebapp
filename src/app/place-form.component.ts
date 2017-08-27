import { Component, Input }         from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Place }                    from './place';
import { PlaceService }             from './place.service';


@Component({
  selector: 'place-form',
  templateUrl: './place-form.component.html'
})
export class PlaceFormComponent {
    private submitted = false;
    model = new Place(undefined, undefined, undefined, undefined, undefined, undefined);
    longitude: any;
    latitude: any;
    callback: any;

  constructor(public activeModal: NgbActiveModal, private placeService: PlaceService) {

  }

  onSubmit(): void  {
    this.submitted = true;
    var newName = this.model.description;
    if (!newName) { return; }
    console.log("onSubmit " + newName);

    this.model.point = "SRID=4326;POINT(" + this.longitude + " " + this.latitude + ")";


    console.log("onSubmit this.model.image " + this.model.image );
    console.dir(this.model);
    this.placeService.createPlace(this.model)
      .then(place => {
        console.log("onSubmit ok createPlace devuelve place:");
        console.dir(place);
        this.callback();

      });
  }
  ok(): void{
    this.activeModal.close();
    console.log(this.placeService.getPlaces());
  }

  disableSendButton(event:any){

  }
  imageRemoved(event:any){

  }
  imageUploaded(file:any){
    console.log("imageUploaded file" + file.file );
    console.log("imageUploaded file[0]" + file[0] );
    console.dir(file);
    this.model.image = file.src;
    console.log("imageUploaded this.model.image" + this.model.image );

  }
}
