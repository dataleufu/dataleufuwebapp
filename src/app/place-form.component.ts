import {Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import {NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {Place, Category, ImagePlace, ExifConverter}          from './place';
import {PlaceService }             from './place.service';
import {CategoryService }          from './category.service';
import {BusyModule}              from 'angular2-busy';
import {ElementRef, ComponentFactory,ComponentRef, ComponentFactoryResolver}  from '@angular/core';
import {CreatePointComponent }            from './create-point.component';

declare var EXIF : any;
declare var Cesium : any;



@Component({
  selector: 'place-form',
  templateUrl: './place-form.component.html'
})
export class PlaceFormComponent implements OnInit{
    public submitted = false;
    model = new Place(undefined, undefined, [], undefined, undefined, undefined, undefined);
    newPlace: Place;
    longitude: any;
    latitude: any;
    categories: Category[];
    busy: Promise<any>;
    @Input() viewer: any;
    @Input() mapComponent: any;
    selectingPoint = false;
    POINT_MODE_EMPTY = 0;
    POINT_MODE_EXIF = 1;
    POINT_MODE_SELECTION = 2;
    pointMode: number;
    @Output() cancelled = new EventEmitter<any>();
    @Output() pointCreated = new EventEmitter<any>();
    @Output() entity: any;
    newId: string;
    handler: any;

  constructor(private placeService: PlaceService,
    private categoryService: CategoryService, private resolver: ComponentFactoryResolver) {
        console.log("PlaceFormComponent constructor " + this.categories);
        this.pointMode = this.POINT_MODE_EMPTY;
  }

  ngOnInit(): void {

    this.categoryService
        .getCategories()
        .then(categories => this.categories = categories);

  }

  hasImage(): boolean{
      if(this.model.images.length > 0)
         return true;
      return false;
  }

    flyToMyLocation(event){
        if(event)
            event.preventDefault();
        this.mapComponent.gotoMyLocation();
    }

  validForm(): boolean{
      if (this.model.category && this.model.description && this.hasImage())
         return true;
      return false;
  }

  onSubmit(): any  {
    this.model.point = "SRID=4326;POINT(" + this.longitude + " " + this.latitude + ")";
    this.model.owner = undefined;
    this.busy = this.placeService.createPlace(this.model)
      .then(place => {
        console.log("onSubmit ok " + JSON.stringify(place));
        this.newPlace = place;
        this.submitted = true;
        this.pointCreated.emit(place);

      });
  }

  cancel(): void{
    this.cancelled.emit();
  }

  disableSendButton(state:boolean){
  }

  imageRemoved(event:any){
    this.pointMode = this.POINT_MODE_EMPTY;
    this.model.images = [];
  }

  imageUploaded(file:any){
    var image = new ImagePlace(null, file.src, "new");
    this.model.images.push(image);
    var that = this;
    EXIF.getData(file, function() {
        var g = new ExifConverter(EXIF.getTag(this, "GPSLatitude"),
            EXIF.getTag(this, "GPSLatitudeRef"),
            EXIF.getTag(this, "GPSLongitude"),
            EXIF.getTag(this, "GPSLongitudeRef"));
        if (g.valid){
            that.latitude = g.Latitude;
            that.longitude = g.Longitude;
            console.log("g.Latitude", g.Latitude);
            console.log("g.Longitude", g.Longitude);
            that.pointMode = that.POINT_MODE_EXIF;
        }
        else{
            that.pointMode = that.POINT_MODE_EMPTY;
        }
    });
  }
    pointSelected(event:any){
        this.onSubmit();
    }

    cancelSelectPoint(event:any){
        this.selectingPoint = false;
        this.pointMode = this.POINT_MODE_EMPTY;
        if (this.newId)
            this.viewer.entities.removeById(this.newId);
    }

    selectPoint(event:any){
        console.log("selectPoint");
        this.selectingPoint = true;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction((click:any) => {

            var cartesian = this.viewer.camera.pickEllipsoid(click.position, this.viewer.scene.globe.ellipsoid);
            if (!cartesian) return;
            var position = this.viewer.camera.pickEllipsoid(click.position);
            var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
            this.newId = 'customId' + new Date().getUTCMilliseconds();
            var newPoint = this.viewer.entities.add({
                 position: position,
                 id: this.newId,
                 name : 'Nuevo punto',
                 point : {
                     pixelSize : 35,
                     outlineWidth : 1,
                     color :  Cesium.Color.YELLOW.withAlpha(1),
                     outlineColor :  Cesium.Color.YELLOW.withAlpha(1)
                },
            });
            this.longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
            this.latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
            this.entity = newPoint;
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

            this.pointMode = this.POINT_MODE_SELECTION;


        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }

    ngOnDestroy() {
        if (this.handler)
            this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

        if (this.newId)
            this.viewer.entities.removeById(this.newId);
        console.log("PlaceFormComponent ngOnDestroy");
    }

}
