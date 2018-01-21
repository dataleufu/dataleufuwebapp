import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import {Input,ElementRef, ComponentFactory,ComponentRef, ComponentFactoryResolver, ViewContainerRef, ChangeDetectorRef,  ViewChild, TemplateRef, Output, EventEmitter} from '@angular/core'

declare var Cesium : any;

@Injectable()
export class MapService {
  public cesium: any;

  private viewer: any;

  constructor() {
      this.cesium = Cesium;
      console.log("MapService constructor");
  }

  init(el:any){
        console.log("MapService init");
        this.cesium.BingMapsApi.defaultKey = 'ApTt78Y0u6795QNTrQ-9DFWdJxW8THvNVvHF1B19ayEzw1aiRXmunxndbwB_deO_';
        this.viewer =  new this.cesium.Viewer( el, {
              baseLayerPicker: false,
              fullscreenButton: false    ,
              homeButton: false,
              sceneModePicker: false,
              timeline: false,
              animation: false,
              geocoder: false,
              selectionIndicator: true,
              infoBox: false,
              navigationHelpButton: false
            });
        console.log("MapService init end");
  }

  getMap():any{
      return this.viewer;
  }

  getCamera():any{
      return this.viewer.scene.camera;
  }

  getScene():any{
      return this.viewer.scene;
  }

}

