import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Place, Category, ImagePlace}          from './place';
import { PlaceService }             from './place.service';
import { CategoryService }          from './category.service';
import {BusyModule}              from 'angular2-busy';
import { APP_BASE_URL } from './config';

@Component({
  selector: 'place-form',
  templateUrl: './place-image-edition.component.html'
})
export class PlaceImageEditionComponent implements OnInit{
    public submitted = false;
    model: Place;
    place: Place;
    busy: Promise<any>;
    @Output() done = new EventEmitter<Place>();
    @Output() imagesNames: string[];

  constructor(public activeModal: NgbActiveModal, private placeService: PlaceService) {
  }

  ngOnInit(): void {
    this.model = this.place;
    this.imagesNames = this.model.images.map(function(im:any) { return im.image;})
  }

  onSubmit(): any  {
    var newImages = this.model.images.map(function(im:any) { return Object.assign({}, im);});
    newImages.forEach(function(image:any) {
        if (image.pk){
            console.log("blankeo la imagen");
            image.image = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
        }
    });
    this.busy = this.placeService.updateImages(this.model, newImages)
      .then(place => {
        this.done.emit(place);
        this.submitted = true;
      });
  }

  cancel(): void{
    this.activeModal.close();
  }

  disableSendButton(state:boolean){
  }

  imageRemoved(file:any){
      var name = file.src;
      var found = this.model.images.find(function(image) {
          return image.image == name;
        });
      if (found){
          found.action = 'delete';
      }
  }

  imageUploaded(file:any){
    var image = new ImagePlace(null, file.src, "new");
    this.model.images.push(image);

  }
}
