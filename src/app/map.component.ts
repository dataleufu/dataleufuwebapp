import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { AboutComponent }       from './about.component';
import { PlaceFormComponent }   from './place-form.component';
import { PlaceService }            from './place.service';
import { TestComponent }            from './test.component';
import { CreatePointComponent }            from './create-point.component';
import { PlaceDetailComponent }         from './place-detail.component';
import { LayerComponent }         from './layer.component';
import { LayerService }         from './layer.service';
import { PathComponent }         from './path.component';
import {Input,ElementRef, ComponentFactory,ComponentRef, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef,  ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core'
import {UserProfile, Place, Point, GeoPlace} from './place';
import { UserComponent }         from './user.component';
import { MessageComponent }         from './message.component';
import 'rxjs/add/operator/switchMap';


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
    user: UserProfile;

    @ViewChild("messageContainer", { read: ViewContainerRef }) messageContainer: any;
    messageComponentRef: any;

    @ViewChild("detailContainer", { read: ViewContainerRef }) detailContainer: any;
    detailComponentRef: any;

    @ViewChild("layerContainer", { read: ViewContainerRef }) layerContainer: any;
    layerComponentRef: any;

    @ViewChild("pathContainer", { read: ViewContainerRef }) pathContainer: any;
    pathComponentRef: any;

    @ViewChild("userContainer", { read: ViewContainerRef }) userContainer: any;
    userComponentRef: any;

    constructor(public element: ElementRef, private modalService: NgbModal,
            private placeService: PlaceService, private layerService: LayerService,
            private resolver: ComponentFactoryResolver,
            private route: ActivatedRoute,){}

    ngOnInit() {
        Cesium.BingMapsApi.defaultKey = 'ApTt78Y0u6795QNTrQ-9DFWdJxW8THvNVvHF1B19ayEzw1aiRXmunxndbwB_deO_';
        var el = this.element.nativeElement;
        this.viewer =  new Cesium.Viewer( el, {
              baseLayerPicker: false,
              fullscreenButton: false    ,
              homeButton: false,
              sceneModePicker: false,
              timeline: false,
              animation: false,
              geocoder: false,
              selectionIndicator: true,
              infoBox: false,
              navigationHelpButton: false,
              creditContainer: 'page-content-wrapper',
            });
            /*this.viewer.scene.frameState.creditDisplay.beginFrame();
            var credit = new Cesium.Credit('RadarLeufú', 'assets/images/logo.png');
            this.viewer.scene.frameState.creditDisplay.addDefaultCredit(credit);*/

        this.initUser();
        this.initPaths();
        this.initDetails();


        var that = this;
        var promise = this.pathComponentRef.instance.rotate().then(
            function () {
                that.initLayers();

                that.route.paramMap
                    .switchMap((params: ParamMap) => {
                        if (+params.get('id') != 0)
                            return that.placeService.getPlace(+params.get('id'));
                        else{
                            that.pathComponentRef.instance.rio(null);
                            return [];
                        }

                    })
                    .subscribe(place => that.gotoPlace(place));

                }
            );

    }

    gotoPlace(place: GeoPlace){
        if (place){
            this.detailComponentRef.instance.testPlace(place);
            var options = {

                destination : Cesium.Cartesian3.fromDegrees(place.point.coordinates[0], place.point.coordinates[1], 1000),
                duration: 6,
                /*  orientation: {
                    heading : 6.1329933722128125,//Cesium.Math.toRadians(15.0),
                    pitch : -0.25777284671769296, //-Cesium.Math.PI_OVER_FOUR,
                    roll : 6.271157632771452//0.0
                },*/
                pitchAdjustHeight: 800,
                complete: function() {
                    setTimeout(function() {
                       // TODO
                    }, 1000);
                }
            };
            this.viewer.scene.camera.flyTo(options);

        }else{
            this.pathComponentRef.instance.rio(null);
        }
    }

    logCamera(event: any): void{
        event.preventDefault();
        console.log("Inicia log camera");
        console.log("*****************");
        var camera = this.viewer.scene.camera;
        //console.log("position: " + camera.position);
        console.log("positionCartographic: " + camera.positionCartographic);
        //console.log("positionWC: " + camera.positionWC);
        console.log("pitch: " + camera.pitch);
        //console.log("right: " + camera.right);
        //console.log("rightWC: " + camera.rightWC);
        console.log("roll: " + camera.roll);
        //console.log("up: " + camera.up);
        //console.log("upWC: " + camera.upWC);
        console.log("heading: " + camera.heading);
        //console.log("direction: " + camera.direction);
        //console.log("directionWC: " + camera.directionWC);
        console.log("Fin log camera");
        console.log("*****************");



    }
    about(event: any): void {
        event.preventDefault();
        const modalRef = this.modalService.open(AboutComponent, { windowClass: 'modal-fullscreen' });
    }


    initDetails(){
        //Creo el componente de visualización de detalles
        this.detailContainer.clear();
        const factory: any = this.resolver.resolveComponentFactory(PlaceDetailComponent);
        this.detailComponentRef = this.detailContainer.createComponent(factory);
        this.detailComponentRef.instance.viewer = this.viewer;
    }
    initLayers():void{
        //Creo el componente de visualización de capas
        this.layerContainer.clear();
        const factory: any = this.resolver.resolveComponentFactory(LayerComponent);
        this.layerComponentRef = this.layerContainer.createComponent(factory);
        this.layerComponentRef.instance.viewer = this.viewer;
    }

    initPaths(){
        //Creo el componente de visualización de recorridos
        console.log("initPaths");
        this.pathContainer.clear();
        const factory: any = this.resolver.resolveComponentFactory(PathComponent);
        this.pathComponentRef = this.pathContainer.createComponent(factory);
        this.pathComponentRef.instance.viewer = this.viewer;
    }

    initUser(){
        //Creo el componente de gestión del menú de usuarios
        console.log("initUser");
        this.userContainer.clear();
        const factory: any = this.resolver.resolveComponentFactory(UserComponent);
        this.userComponentRef = this.userContainer.createComponent(factory);
        this.userComponentRef.instance.viewer = this.viewer;
        this.userComponentRef.instance.user.subscribe((user:any) => {
            this.user = user;
        })
    }

    ngOnDestroy() {
        this.messageComponentRef.destroy();
        this.detailComponentRef.destroy();
    }

    addPoint(event:any):void{
        event.preventDefault();

        if (!this.user){
            this.message("Para ingresar un punto debes registrarte.");
            return;
        }
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
            modalRef.componentInstance.callback = function(category:any){
                var layer = that.layerComponentRef.instance.getCategoryLayer(category);
                that.layerComponentRef.instance.relaodLayer(layer);
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
        this.layerComponentRef.instance.collapsed = !this.layerComponentRef.instance.collapsed;
    }

    collapsePaths(event: any){
        event.preventDefault();
        this.pathComponentRef.instance.collapsed = !this.pathComponentRef.instance.collapsed;
    }
    message(text:string){
        const modalRef = this.modalService.open(MessageComponent);
        modalRef.componentInstance.message = text;
    }

}
