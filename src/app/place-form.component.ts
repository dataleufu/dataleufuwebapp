import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Place, Category, ImagePlace}          from './place';
import { PlaceService }             from './place.service';
import { CategoryService }          from './category.service';
import {BusyModule}              from 'angular2-busy';


@Component({
  selector: 'place-form',
  templateUrl: './place-form.component.html'
})
export class PlaceFormComponent implements OnInit{
    public submitted = false;
    model = new Place(undefined, undefined, [], undefined, undefined, undefined, undefined);
    longitude: any;
    latitude: any;
    callback: any;
    callbackCancel: any;
    categories: Category[];
    busy: Promise<any>;

  constructor(public activeModal: NgbActiveModal, private placeService: PlaceService,
    private categoryService: CategoryService) {
        console.log("PlaceFormComponent constructor " + this.categories);
  }

  ngOnInit(): void {
    this.categoryService
        .getCategories()
        .then(categories => this.categories = categories);
    console.log("PlaceFormComponent ngOnInit " + this.categories);
    console.log("PlaceFormComponent ngOnInit longitude " + this.longitude + " latitude" + this.latitude);

  }

  onSubmit(): any  {
    this.model.point = "SRID=4326;POINT(" + this.longitude + " " + this.latitude + ")";
    this.model.owner = undefined;
    this.busy = this.placeService.createPlace(this.model)
      .then(place => {
        this.submitted = true;
        this.callback(this.model.category);
      });
  }

  cancel(): void{
    this.callbackCancel();
    this.activeModal.close();

  }

  disableSendButton(state:boolean){
        console.log("disableSendButton " + JSON.stringify(state));
  }
  imageRemoved(event:any){

  }
  imageUploaded(file:any){
    console.log("imageUploaded file" + file.file );
    var image = new ImagePlace(null, file.src);
    this.model.images.push(image);


  }
}
