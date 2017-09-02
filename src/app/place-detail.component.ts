import { Component, OnInit }         from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core'
import { PlaceService }            from './place.service';

declare var Cesium : any;

@Component({
    selector: 'place-detail',
    templateUrl: './place-detail.component.html',

})
export class PlaceDetailComponent implements OnInit{

    @Input() viewer: any;
    handler: any;
    currentEntity: any;
    currentPlace: any;

    constructor(private placeService: PlaceService) {}

    flyToEntity(){
        console.log("flyToEntity " + this.currentEntity);
        if(this.currentEntity !== undefined){
            this.viewer.flyTo(this.currentEntity);
        }
    }
    setCurrentItem(item: any){
        console.log("setCurrentItem item" + item);
        this.currentEntity = item;
        console.dir(this.currentEntity);
        if(item !== undefined){
            var id = item.properties.pk;
            this.placeService
                .getPlace(+id)
                    .then(place => this.currentPlace = place);
        }else{
            this.currentPlace = undefined;
        }
        console.log("setCurrentItem currentPlace " + this.currentPlace);

    }
    ngOnInit() {
        console.log("PlaceDetailComponent oninit");
        var that = this;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function(movement:any){
            var item = false;
            if (that.viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
                //var pickedObject = that.viewer.scene.pick(movement.endPosition);
                var pickedObject = that.viewer.scene.pick(movement.position);
                if (that.viewer.scene.pickPositionSupported && Cesium.defined(pickedObject) ) {
                    var cartesian = that.viewer.scene.pickPosition(movement.position);
                    if (Cesium.defined(cartesian)) {
                        //that.setCurrentItem(pickedObject.id.properties.pk);
                        that.setCurrentItem(pickedObject.id);
                        item = true;
                    }
                }
            }
            if (!item){
                that.setCurrentItem(undefined);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }
}
