import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AboutComponent }       from './about.component';
import { PlaceFormComponent }   from './place-form.component';
import { PlaceService }            from './place.service';
import { TestComponent }            from './test.component';
import { CreatePointComponent }            from './create-point.component';
import { PlaceDetailComponent }         from './place-detail.component';
import {Input,ElementRef, ComponentFactory,ComponentRef, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef,  ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core'

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
    public isCollapsed = true;

    @ViewChild("messageContainer", { read: ViewContainerRef }) messageContainer: any;
    messageComponentRef: any;

    @ViewChild("detailContainer", { read: ViewContainerRef }) detailContainer: any;
    detailComponentRef: any;

    constructor(public element: ElementRef, private modalService: NgbModal,
            private placeService: PlaceService,
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
        this.viewer =  new Cesium.Viewer( el, {
              baseLayerPicker: true,
              fullscreenButton: true    ,
              homeButton: true,
              sceneModePicker: true,
              timeline: false,
              animation: false,
              geocoder: true,
              selectionIndicator: true,
              infoBox: false
            });

        this.addLayer();
        this.setEvents();
        //setTimeout(this.full3, 3000, this.viewer);
    }

    about(event: any): void {
        event.preventDefault();
        const modalRef = this.modalService.open(AboutComponent, { windowClass: 'modal-fullscreen' });
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
        //Creo el componente de visualización de detalles
        this.detailContainer.clear();
        const factory: any = this.resolver.resolveComponentFactory(PlaceDetailComponent);
        this.detailComponentRef = this.detailContainer.createComponent(factory);
        this.detailComponentRef.instance.viewer = this.viewer;
    }

    ngOnDestroy() {
        this.messageComponentRef.destroy();
        this.detailComponentRef.destroy();
    }
    addPoint(event:any):void{
        event.preventDefault();

        var that = this;

        //Creo el punto
        this.messageContainer.clear();
        const factory: any = this.resolver.resolveComponentFactory(CreatePointComponent);
        this.messageComponentRef = this.messageContainer.createComponent(factory);
        this.messageComponentRef.instance.viewer = this.viewer;

        this.messageComponentRef.instance.ready.subscribe((event:any) => {

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


        this.messageComponentRef.instance.close.subscribe((event:any) => {
            this.messageComponentRef.destroy()
            });

    }
    collapseLayers(event: any){
        event.preventDefault();
        this.isCollapsed = !this.isCollapsed;
    }
}
