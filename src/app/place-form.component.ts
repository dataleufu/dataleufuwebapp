import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Place, Category }          from './place';
import { PlaceService }             from './place.service';
import { CategoryService }          from './category.service';


@Component({
  selector: 'place-form',
  templateUrl: './place-form.component.html'
})
export class PlaceFormComponent implements OnInit{
    private submitted = false;
    model = new Place(undefined, undefined, undefined, undefined, undefined, undefined, undefined);
    longitude: any;
    latitude: any;
    callback: any;
    callbackCancel: any;
    categories: Category[];

  constructor(public activeModal: NgbActiveModal, private placeService: PlaceService, private categoryService: CategoryService) {
        console.log("PlaceFormComponent constructor " + this.categories);
  }

  ngOnInit(): void {
    this.categoryService
        .getCategories()
        .then(categories => this.categories = categories);
    console.log("PlaceFormComponent ngOnInit " + this.categories);
    console.log("PlaceFormComponent ngOnInit longitude " + this.longitude + " latitude" + this.latitude);

  }
  onSubmit(): void  {
    console.log("PlaceFormComponent submit " + this.categories);
    this.submitted = true;
    var newName = this.model.description;
    if (!newName) { return; }
    console.log("onSubmit " + newName);

    this.model.point = "SRID=4326;POINT(" + this.longitude + " " + this.latitude + ")";
    console.log("this.model.point " + this.model.point);

    console.log("onSubmit this.model.image " + this.model.image );
    console.dir(this.model);
    this.placeService.createPlace(this.model)
      .then(place => {
        console.log("onSubmit ok createPlace devuelve place:");
        console.dir(place);
        this.callback(this.model.category);

      });
  }
  cancel(): void{
    this.callbackCancel();
    this.activeModal.close();

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
