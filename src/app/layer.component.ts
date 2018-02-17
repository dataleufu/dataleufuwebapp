import { Component, OnInit }         from '@angular/core';
import {Input, Output, EventEmitter} from '@angular/core'
import { LayerService }         from './layer.service';
import { Layer, Category }         from './place';
import { MapService }         from './map.service';
import {TrackerService} from "./tracker.service";

declare var Cesium : any;

@Component({
    selector: 'layers',
    templateUrl: './layer.component.html',

})
export class LayerComponent implements OnInit{

    layers: Layer[];
    public collapsed = false;
    constructor(private layerService: LayerService, private mapService: MapService,
        private tracker: TrackerService) { console.log("LayerComponent constructor ");}

    ngOnInit() {
        console.log("LayerComponent ngOnInit ");
        this.layerService
            .getLayers()
            .then((layers) => {
                this.loadLayers(layers);//.then( () => this.layers = layers;);
                this.layers = layers; //seteo los layers sin esperar que carguen
            });
    }

    getCategoryLayer(category: Category): Layer {
        return this.layers.find(x => +x.category.pk === category.pk );
    }


    loadLayer(layer:Layer): Promise<any>{
        var that = this;
        console.log("Loading layer ... " + layer.name);
        var geoJsonPromise = Cesium.GeoJsonDataSource.load(layer.url);
        geoJsonPromise.then(function (datasource1:any) {
            var datasourcePromise = that.mapService.getMap().dataSources.add(datasource1);
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
        return geoJsonPromise;
    }

    loadLayers(layers: Layer[]): Promise<any>{
        var promises = new Array();
        layers.forEach((layer, indice, array) => {
            promises.push(this.loadLayer(layer));
        });
        return Promise.all(promises).then( () => { });
    }
    hideLayer(layer:Layer){
        var removed = this.mapService.getMap().dataSources.remove(layer.datasource);
        if (removed)
            layer.visible = false;
    }

    checkLayer(layer:Layer){
        if (layer.visible == false){
            this.loadLayer(layer);
            this.tracker.emitEvent("capas", "ver_capa", layer.name);
        }else{
            this.hideLayer(layer);
            this.tracker.emitEvent("capas", "ocultar_capa", layer.name);
        }

    }
    relaodLayer(layer:Layer){
        this.hideLayer(layer);
        this.loadLayer(layer);
    }

}
