import { Component, OnInit, Input } from '@angular/core';
import { Router }            from '@angular/router';
import { ViewChild, ElementRef} from '@angular/core' /*Import View Child*/
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AboutComponent }       from './about.component';
import { PlaceFormComponent }   from './place-form.component';
import { PlaceService }            from './place.service';
import { TestComponent }            from './test.component';
import { CreatePointComponent }            from './create-point.component';
import {Input,ComponentFactory,ComponentRef, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef, TemplateRef, ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core'

declare var Cesium : any;


@Component({
  selector: 'map',
  templateUrl: './map.component.html',
})
export class MapComponent implements OnInit {
    viewer: any;
    currentItem: any;
    selectingPoint: any;
    docElement: any;

    @ViewChild("messageContainer", { read: ViewContainerRef }) messageContainer;
    messageContainerComponentRef: ComponentRef;

    constructor(public element: ElementRef, private modalService: NgbModal,
            private placeService: PlaceService, private popup: PopupService,
            private resolver: ComponentFactoryResolver){}

    testFlyTo(event: any): void {
        event.preventDefault();
        console.log("start");
        var startingLocation = {
            centerLong: (-67.573360 * Math.PI / 180),
            centerLat: (-39.094721 * Math.PI / 180)
        };

        this.viewer.camera.flyTo({
            destination: new Cesium.Cartesian3.fromDegrees(startingLocation.centerLong * 180/Math.PI, startingLocation.centerLat * 180/Math.PI, 500)
        });

    }

    full2(): void {
        console.log("start");
        var startingLocation = {
            centerLong: (-98.343286 * Math.PI / 180),
            centerLat: (40.923664 * Math.PI / 180)
        };

        var initialPosition = new Cesium.Cartesian3.fromDegrees(-73.998114468289017509, 40.674512895646692812, 2631.082799425431);
        var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(7.1077496389876024807, -31.987223091598949054, 0.025883251314954971306);
        var homeCameraView = {
            destination : initialPosition,
            orientation : {
                heading : initialOrientation.heading,
                pitch : initialOrientation.pitch,
                roll : initialOrientation.roll
            }
        };
        // Set the initial view
        this.viewer.scene.camera.setView(homeCameraView);


        // Override the default home button
        this.viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e:any) {
            e.cancel = true;
            this.viewer.scene.camera.flyTo(homeCameraView);
        });


    }

    ngOnInit() {
        Cesium.BingMapsApi.defaultKey = 'ApTt78Y0u6795QNTrQ-9DFWdJxW8THvNVvHF1B19ayEzw1aiRXmunxndbwB_deO_';
        var el = this.element.nativeElement;
        this.viewer =  new Cesium.Viewer( el);/*, {
              baseLayerPicker: true,
              fullscreenButton: true    ,
              homeButton: true,
              sceneModePicker: true,
              selectionIndicator: true,
              timeline: false,
              animation: false,
              geocoder: true
            });*/

        console.log("Cesium.BingMapsApi.defaultKey" + Cesium.BingMapsApi.defaultKey);
        this.addLayer();
        this.setEvents();
        //setTimeout(this.full3, 3000, this.viewer);
    }

    about(event: any): void {
        event.preventDefault();
        const modalRef = this.modalService.open(AboutComponent, { windowClass: 'modal-fullscreen' });
        console.log("about dd modalRef" + modalRef);
    }


    addLayer() {
        console.log("Ingreso a addLayer");
        var viewer = this.viewer;
        var promise = Cesium.GeoJsonDataSource.load('http://mexico.q123.com.ar:8000/places/',
            {proxy:new Cesium.DefaultProxy("http://localhost:8080/proxy/")});
        promise.then(function(dataSource:any) {
            console.log("Promise load layer");
            viewer.dataSources.add(dataSource);
            var entities = dataSource.entities.values;
            console.log("Promise entities.length " + entities.length);
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                entity.billboard = {scaleByDistance:new Cesium.NearFarScalar(1.5e3, 0.3, 3.5e5, 0.0)};
                entity.point = new Cesium.PointGraphics({
                    color: Cesium.Color.ORCHID,
                    pixelSize: 10
                });
                console.log("Promise entity.point " + entity.pointh);
            }
            viewer.flyTo(dataSource);
            console.log("Promise flyTo end");
        }).otherwise(function(error:any){
            //Display any errrors encountered while loading.
            window.alert(error);
        });
    }
    setEvents(){
        var that = this;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(function(movement:any){
            var item = false;
            if (that.viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
                //var pickedObject = that.viewer.scene.pick(movement.endPosition);
                var pickedObject = that.viewer.scene.pick(movement.position);
                if (that.viewer.scene.pickPositionSupported && Cesium.defined(pickedObject) ) {
                    var cartesian = that.viewer.scene.pickPosition(movement.position);
                    if (Cesium.defined(cartesian)) {
                        that.setCurrentItem(pickedObject.id.properties.pk);
                        item = true;
                    }
                }
            }
            if (!item){
                that.setCurrentItem(undefined);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }
    ngOnDestroy() {
        this.messageComponentRef.destroy();
    }
    addPoint(event:any):void{
        event.preventDefault();
        console.log("addPoint");

        var that = this;

        //Creo el punto
        this.messageContainer.clear();
        const factory: ComponentFactory = this.resolver.resolveComponentFactory(CreatePointComponent);
        this.messageComponentRef = this.messageContainer.createComponent(factory);
        this.messageComponentRef.instance.viewer = this.viewer;

        this.messageComponentRef.instance.ready.subscribe(event => {

            this.messageComponentRef.destroy()

            const modalRef = this.modalService.open(PlaceFormComponent);
            modalRef.componentInstance.longitude = this.messageComponentRef.instance.lon;
            modalRef.componentInstance.latitude = this.messageComponentRef.instance.lat;
            modalRef.componentInstance.callback = function(){
                that.addLayer();
                that.viewer.flyTo(that.messageComponentRef.instance.entity);
            };
            modalRef.componentInstance.callbackCancel = function(){
                that.viewer.entities.removeById(that.messageComponentRef.instance.entity.id);
            };
        });


        this.messageComponentRef.instance.close.subscribe(event => {
            this.messageComponentRef.destroy()
            });

        //console.log("this.componentRef.instance test " + this.componentRef.instance.test);

        //this.popup.show.next(true);

        /*var that = this;
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        that.selectingPoint = true;
        handler.setInputAction(function(click:any){
            var cartesian = that.viewer.camera.pickEllipsoid(click.position, that.viewer.scene.globe.ellipsoid);
            if (!cartesian) return;


            var position = that.viewer.camera.pickEllipsoid(click.position);
            var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
            var id = 'customId' + new Date().getUTCMilliseconds();
            console.log("id " + id);
            var newPoint = that.viewer.entities.add({
                 position: position,
                 id: id,
                 name : 'point on surface with outline',
                 point : {
                     pixelSize : 50,
                     outlineWidth : 1,
                     color :  Cesium.Color.YELLOW.withAlpha(1),
                     outlineColor :  Cesium.Color.RED.withAlpha(1)
                },
            });
            console.log("newPoint: " + newPoint);
            console.log("newPoint.id " + newPoint.id);
            //that.viewer.zoomTo(newPoint);

            const modalRef = that.modalService.open(PlaceFormComponent);
            modalRef.componentInstance.name = 'PlaceFormComponent';
            modalRef.componentInstance.longitude = Cesium.Math.toDegrees(cartographicPosition.longitude);
            modalRef.componentInstance.latitude = Cesium.Math.toDegrees(cartographicPosition.latitude);
            modalRef.componentInstance.callback = function(){
                console.log("callback");

                console.log("borrando id " + id);
                that.viewer.entities.removeById(id);
                that.addLayer();
            }
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

            that.selectingPoint = false;
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);*/
    }
     setCurrentItem(id:any):void{
         console.log("setCurrentItem " + id);
        if (id){
            this.placeService
                .getPlace(+id)
                    .then(place => this.currentItem = place);
        }else{
            this.currentItem = undefined;
        }
    }


}
