import { Component, OnInit }         from '@angular/core';
import {Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core'
import { PlaceService }            from './place.service';
import { CategoryService }          from './category.service';
import { Category, Place, ImagePlace } from './place';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_URL } from './config';



declare var Cesium : any;
declare var window: any;

@Component({
    selector: 'place-detail',
    templateUrl: './place-detail.component.html',

})
export class PlaceDetailComponent implements OnInit{
    @ViewChild('fbComments') elementRef: ElementRef;
    @Input() viewer: any;
    handler: any;
    currentEntity: any;
    currentPlace: any;
    categories: Category[];
    visible: boolean;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    currentURL: string;
    lastUrl: string;

    constructor(private placeService: PlaceService, private categoryService: CategoryService) {}

    initFacebook(){
        console.log("initFacebook ngAfterViewInit");
        this.lastUrl = this.currentURL;
        this.currentURL = this.getUrl();
          (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            js = d.createElement(s); js.id = id;
            //js.src = "//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.10&appId=1947080825564588";
            js.setAttribute("src", "//connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v2.10&appId=1947080825564588");

            if (d.getElementById(id)){
              //if <script id="facebook-jssdk"> exists
              delete (<any>window).FB;
              fjs.parentNode.replaceChild(js, fjs);
            } else {
              fjs.parentNode.insertBefore(js, fjs);
            }
          }(document, 'script', 'facebook-jssdk'));
        }

    flyToEntity(event: any){
        event.preventDefault();
        if(this.currentEntity !== undefined){
            this.viewer.flyTo(this.currentEntity, 200);
        }
    }
    close(){
        this.visible = false;
    }


    setCurrentPlace(item: Place){
        if(item !== undefined){
            this.currentPlace = item;
            this.galleryImages = this.initGallery();
            this.visible = true;
        }
    }
    testPlace(place: Place){

        var that = this;
        that.currentPlace = place;
    }

    setCurrentItem(item: any){
        console.log("setCurrentItem item" + item);
        var that = this;
        this.currentEntity = item;
        if(item !== undefined){
            var id = item.id;
            this.visible = true;
            this.placeService
                .getPlace(+id)
                    .then(function (place){
                        that.currentPlace = place;
                        if (that.currentPlace.images.length == 0){
                            that.currentPlace.images.push(new ImagePlace(null, 'http://lorempixel.com/600/400/nature/1'));
                            that.currentPlace.images.push(new ImagePlace(null, 'http://lorempixel.com/600/400/nature/2'));
                            that.currentPlace.images.push(new ImagePlace(null, 'http://lorempixel.com/600/400/nature/3'));
                        }
                        that.galleryImages = that.initGallery();

                    });
        }else{
            this.currentPlace = undefined;
            this.visible = false;
        }
        console.log("setCurrentItem currentPlace " + this.currentPlace);

    }

    beforeTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'tab-comments' ) {
        this.initFacebook();
      }
    }
    getUrl(): string{
        var ret = '';
        if (this.currentPlace != undefined){
            ret = APP_BASE_URL + this.currentPlace.pk.toString();
        }
        else{
            ret = APP_BASE_URL;
        }
        return ret;
    }
    ngOnInit() {
        console.log("PlaceDetailComponent oninit");
        this.categoryService
            .getCategories()
            .then(categories => this.categories = categories);
        var that = this;
        this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function(movement:any){
            var item = false;
            if (that.viewer.scene.mode !== Cesium.SceneMode.MORPHING) {
                //var pickedObject = that.viewer.scene.pick(movement.endPosition);
                var pickedObject = that.viewer.scene.pick(movement.position);
                console.log("pick pickedObject: ");
                console.dir(pickedObject);
                console.log("that.viewer.scene.pickPositionSupported " + that.viewer.scene.pickPositionSupported);
                if (that.viewer.scene.pickPositionSupported && Cesium.defined(pickedObject) ) {
                    var cartesian = that.viewer.scene.pickPosition(movement.position);
                    console.log("cartesian " + cartesian);
                    that.setCurrentItem(pickedObject.id);
                        item = true;
                }
            }
            if (!item){
                that.setCurrentItem(undefined);
            }

        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.galleryOptions = [
            {
                width: '100%',
                height: '480px',
                thumbnails: false,
                imageAnimation: NgxGalleryAnimation.Slide
            },
            // max-width 400
            {
                breakpoint: 400,
                width: '100%',
                height: '330px',
            }
        ];
        this.galleryImages = [];
    }

    initGallery(){
        var galleryImages:NgxGalleryImage[] = [];
        if (this.currentPlace){
            var imageDescription = this.currentPlace.description;
            this.currentPlace.images.forEach(function(image:any) {
                galleryImages.push({
                    small: image.image,
                    medium: image.image,
                    big: image.image,
                    description: imageDescription.substring(0, 200)});
            });
        };
        return galleryImages;

    }
    getCategory(id: number): Category {
        return this.categories.find(x => x.pk == id );
    }


}
