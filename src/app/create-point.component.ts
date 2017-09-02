import { Component }         from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core'

//TODO drag point http://localhost:8001/cesium-google-earth-examples/examples/pinDrag.html

@Component({
    selector: 'create-point',
    template: `
    <div class="place_card">
        <h1>Selecciona un punto en el mapa</h1>
        <button type="button" (click)="accept()" class="btn btn-success" [disabled]="!lat">Listo</button>
        <button type="button" (click)="cancel()" class="btn btn-primary">Cancelar</button>
    </div>
    `
})
export class CreatePointComponent implements OnInit{

    @Input() viewer: any;
    @Output() close = new EventEmitter();
    @Output() ready = new EventEmitter();
    @Output() lat: any;
    @Output() lon: any;
    @Output() entity: any;
    newId: string;
    handler: any;

    constructor() {}

    cancel(){
        console.log("CreatePointComponent cancel");
        console.log("CreatePointComponent cancel remove this.newId " + this.newId);
        this.viewer.entities.removeById(this.newId);
        this.close.next();
    }

    accept(){
        console.log("CreatePointComponent ready");

        this.ready.next();
    }
    ngOnDestroy() {
        this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    ngOnInit() {
        console.log("CreatePointComponent oninit");
        var that = this;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function(click:any){
            var cartesian = that.viewer.camera.pickEllipsoid(click.position, that.viewer.scene.globe.ellipsoid);
            if (!cartesian) return;
            var position = that.viewer.camera.pickEllipsoid(click.position);
            var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
            that.newId = 'customId' + new Date().getUTCMilliseconds();
            var newPoint = that.viewer.entities.add({
                 position: position,
                 id: that.newId,
                 name : 'Nuevo punto',
                 point : {
                     pixelSize : 35,
                     outlineWidth : 1,
                     color :  Cesium.Color.YELLOW.withAlpha(1),
                     outlineColor :  Cesium.Color.YELLOW.withAlpha(1)
                },
            });
            that.lon = Cesium.Math.toDegrees(cartographicPosition.longitude);
            that.lat = Cesium.Math.toDegrees(cartographicPosition.latitude);
            that.entity = newPoint;
            that.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
            console.log("Se creo lon: " + that.lon);
            console.log("Se creo lat: " + that.lat);


        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    }
}
