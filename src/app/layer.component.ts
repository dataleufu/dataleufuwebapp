import { Component, OnInit }         from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core'
import { LayerService }         from './layer.service';
import { Layer }         from './place';

declare var Cesium : any;

@Component({
    selector: 'layers',
    templateUrl: './layer.component.html',

})
export class LayerComponent implements OnInit{

    @Input() viewer: any;
    layers: Layer[];
    public collapsed = false;
    constructor(private layerService: LayerService,) {}

    ngOnInit() {
        var that = this;
        this.layerService
            .getLayers()
            .then(function (layers) {
                that.layers = layers;
                that.layers.forEach( function(layer, indice, array) {
                    if (layer.visible == true)
                        that.loadLayer(layer);
                    });
                });
    }

    getCategoryLayer(id: number): Layer {
        return this.layers.find(x => +x.category === id );
    }

    loadLayer(layer:Layer){
        var that = this;
        console.log("Loading layer ... " + layer.name);
        var geoJsonPromise = Cesium.GeoJsonDataSource.load(layer.url);
        geoJsonPromise.then(function (datasource1:any) {
            var datasourcePromise = that.viewer.dataSources.add(datasource1);
            datasourcePromise.then(function (datasource2:any){
                var entities = datasource2.entities.values;
                for (var i = 0; i < entities.length; i++) {
                    var entity = entities[i];
                    entity.billboard = {scaleByDistance:new Cesium.NearFarScalar(1.5e3, 0.3, 3.5e5, 0.0)};
                    entity.point = new Cesium.PointGraphics({
                        color: Cesium.Color.fromCssColorString(layer.color),
                        pixelSize: 10
                    });
                }
                layer.datasource = datasource2;
                layer.visible = true;
            });
        });
    }

    hideLayer(layer:Layer){
        var removed = this.viewer.dataSources.remove(layer.datasource);
        if (removed)
            layer.visible = false;
    }

    checkLayer(layer:Layer){
        if (layer.visible == false){
            this.loadLayer(layer)
        }else{
            this.hideLayer(layer)
        }

    }
    relaodLayer(layer:Layer){
        this.hideLayer(layer);
        this.loadLayer(layer);
    }

}
