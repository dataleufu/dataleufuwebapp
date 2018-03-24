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
              baseLayerPicker: true,
              fullscreenButton: false,
              homeButton: false,
              sceneModePicker: false,
              timeline: false,
              animation: false,
              selectionIndicator: true,
              infoBox: false,
              navigationHelpButton: false
            });
        this.viewer.scene.frameState.creditDisplay.beginFrame();

        //Por ahora accedo a atributos privados hasta que Cesium lo resuelva mejor
        this.viewer.scene.frameState.creditDisplay.removeDefaultCredit(this.viewer.scene.frameState.creditDisplay._defaultImageCredits[0]);
        this.viewer.scene.frameState.creditDisplay.addDefaultCredit(
            new this.cesium.Credit({text : '',
                imageUrl : '/assets/images/logo.png',
                link : 'https://radarleufu.com/',
                showOnScreen:true}));

        this.viewer.scene.frameState.creditDisplay.endFrame();
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

