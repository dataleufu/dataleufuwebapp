import { Component, OnInit }         from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core'
import { INITIAL_ROTATION_DURATION } from './config';
import { MapService }         from './map.service';

declare var Cesium : any;

@Component({
    selector: 'paths',
    templateUrl: './path.component.html',

})
export class PathComponent implements OnInit{

    public collapsed = false;

    constructor(private mapService: MapService) {
        console.log("PathComponent constructor");
    }

    ngOnInit() {
    }

    flyPath(start:any, end:any, time:number) {
        var camera = this.mapService.getCamera();
        start.complete = function() {
                setTimeout(function() {
                    camera.flyTo(end);
                }, time);
            }
        camera.flyTo(start);
    }

    rio(event:any):void {
        if(event)
            event.preventDefault();

        var desembocaduraOptions = {
            destination : Cesium.Cartesian3.fromRadians(-1.1151465797357878, -0.7504146865954336, 226846.7174589363),
            orientation: {
                heading : 6.102025379175085,
                pitch : -0.6375156663618835,
                roll : 6.282917557845636
            },
            duration: 8,
            flyOverLongitude: Cesium.Math.toRadians(-65.0)
        };
        var confluenciaOptions = {
            destination : Cesium.Cartesian3.fromRadians(-1.1790568492586284, -0.6946032113225113, 36377.55596511481),
            duration: 6,
            orientation: {
                heading : 6.1329933722128125,//Cesium.Math.toRadians(15.0),
                pitch : -0.25777284671769296, //-Cesium.Math.PI_OVER_FOUR,
                roll : 6.271157632771452//0.0
            },
            pitchAdjustHeight: 400
        };
        this.flyPath(confluenciaOptions, desembocaduraOptions, 1000);
    }

    spinGlobe():void{

        var that = this;
        var dynamicRate = 0.5;
        var previousTime = Date.now();

        var toRemove = that.mapService.getMap().scene.postRender.addEventListener(function (scene:any, time:any){
            var spinRate = dynamicRate;
            var currentTime = Date.now();
            var delta = ( currentTime - previousTime ) / 1000;
            previousTime = currentTime;
            that.mapService.getMap().scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, -spinRate * delta);
        });

        setTimeout(toRemove, INITIAL_ROTATION_DURATION * 1000);

    }

    rotate() {
        var that = this;
        return new Promise(function(resolve, reject) {
            // Set up the real work
            that.spinGlobe();

            // Set up the timeout
            setTimeout(function() {
               resolve();
            }, INITIAL_ROTATION_DURATION * 1000);
        });
    }

    pasoCordoba(event:any):void {
        if(event)
            event.preventDefault();
        var endOptions = {
            destination : Cesium.Cartesian3.fromRadians(-1.1803286861691906, -0.6825283406475927, 601.0377157658678),
            orientation: {
                heading : 3.042851126728875,
                pitch : -0.6022811079737829,
                roll : 6.282791617445074
            },
            duration: 6,
        };
        var initOptions = {
            destination : Cesium.Cartesian3.fromRadians(-1.180222922992554, -0.6817653610450379, 2235.007532344371),
            duration: 6,
            orientation: {
                heading : 3.3277119100318595,//Cesium.Math.toRadians(15.0),
                pitch :  -0.4496279075467613, //-Cesium.Math.PI_OVER_FOUR,
                roll : 0.0006758687817409736
            }
        };
        this.flyPath(initOptions, endOptions, 1000);
    }

    confluencia(event:any):void {
        if(event)
            event.preventDefault();

        var endOptions = {
            destination : Cesium.Cartesian3.fromRadians(-1.18876120787592, -0.6797168690180323, 4982.396358798396),
            orientation: {
                heading :2.1406537131449053,
                pitch : -0.37091465414414104,
                roll : 6.280218826340054
            },
            duration: 6,
        };

        var initOptions = {
            destination : Cesium.Cartesian3.fromRadians(-1.1904721853189928, -0.6788759796173222, 4964.848809250644),
            duration: 6,
            orientation: {
                heading : 2.140653317963096,//Cesium.Math.toRadians(15.0),
                pitch :  -0.37091530523432903, //-Cesium.Math.PI_OVER_FOUR,
                roll : 6.280219916591992
            }
        };
        this.flyPath(initOptions, endOptions, 1000);
    }

}
