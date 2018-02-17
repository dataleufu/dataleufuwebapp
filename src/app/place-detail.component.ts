import { Component, OnInit }         from '@angular/core';
import {Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core'
import { PlaceService }            from './place.service';
import { CategoryService }          from './category.service';
import { Category, Place, ImagePlace } from './place';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { APP_BASE_URL } from './config';
import {FacebookService, InitParams, LoginResponse } from 'ngx-facebook';
// Import to the component where you want to implement the click-to-edit.
import { NdvEditAreaComponent } from './angular2-click-to-edit/ndv.edit.area.component';
import { NdvEditSelectComponent } from './angular2-click-to-edit/ndv.edit.select.component';
import { NgbModal, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { PlaceImageEditionComponent } from './place-image-edition.component';
import { AuthenticationService } from './auth/authentication.service';
import {TrackerService} from "./tracker.service";

declare var Cesium : any;
declare var window: any;

@Component({
    selector: 'place-detail',
    templateUrl: './place-detail.component.html'

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
    @Output() galleryImages: NgxGalleryImage[];
    currentURL: string;
    lastUrl: string;
    description: string;
    category: Category;
    categoryName: string;

    categoryNames: string[];

    constructor(private placeService: PlaceService, private categoryService: CategoryService,
        private fb: FacebookService, private modalService: NgbModal,
        private authenticationService: AuthenticationService,
        private tracker: TrackerService) {}

    initFacebook(){

        let initParams: InitParams = {
          appId: '1947080825564588',
          xfbml: true,
          version: 'v2.8'
        };

        this.fb.init(initParams);

    }

    saveDescription(event:any): void{
        this.placeService.updateDescription(this.currentPlace, event.description).then(place=>{
            this.description = place.description;
            this.tracker.emitEvent("punto", "modificar_descripcion", this.currentPlace.pk);

        });
    }
    saveCategory(event:any): void{

        var category = this.getCategoryByName(event.name);

        this.placeService.updateCategory(this.currentPlace, category).then(place=>{
            var newCategory = place.category;
            this.category = newCategory;
            this.categoryName = newCategory.name;
            this.tracker.emitEvent("punto", "modificar_categoria", this.currentPlace.pk);

        });
    }

    canEdit(): boolean {
        if (this.authenticationService.user_profile && this.authenticationService.user_profile.user &&
            this.currentPlace && this.currentPlace.owner &&
             this.authenticationService.user_profile.user.id == this.currentPlace.owner.user.id  )
            return true;
        return false;
    }

    flyToEntity(event: any){
        event.preventDefault();

        if(this.currentEntity !== undefined){
            this.tracker.emitEvent("punto", "volar_al_punto", this.currentEntity.id);
            this.viewer.flyTo(this.currentEntity, 200);
        }
    }
    close(){
        this.visible = false;
    }

    testPlace(place: Place){

        var that = this;
        that.currentPlace = place;
    }

    setCurrentItem(item: any){

        var that = this;
        this.currentEntity = item;
        if(item !== undefined){
            this.tracker.emitEvent("punto", "ver_punto", item.id);
            var id = item.id;
            this.visible = true;
            this.categoryName = this.getCategory(this.currentEntity.properties.category).name;

            this.placeService
                .getPlace(+id)
                    .then(function (place){
                        that.currentPlace = place;
                        if (that.currentPlace.images.length == 0){
                           }

                        that.galleryImages = that.initGallery();
                        that.currentURL = that.getUrl();
                        that.description = that.currentPlace.description;
                        that.category = that.currentPlace.category;
                        that.categoryName = that.currentPlace.category.name;

                    });
        }else{
            this.currentPlace = undefined;
            this.visible = false;
        }

    }

    beforeTabChange($event: NgbTabChangeEvent) {
      if ($event.nextId === 'tab-comments' ) {
        this.initFacebook();
        this.tracker.emitEvent("punto", "ver_comentarios", this.currentPlace.pk);
      }
      if ($event.nextId === 'tab-info' ) {
          this.tracker.emitEvent("punto", "ver_info", this.currentPlace.pk);
      }
      if ($event.nextId === 'tab-gallery' ) {
          this.tracker.emitEvent("punto", "ver_fotos", this.currentPlace.pk);
      }
    }
    facebookOpened(param: any):void{
        this.tracker.emitEvent("punto", "compartir_facebook", this.currentPlace.pk);
    }
    twitterOpened(param: any):void{
        this.tracker.emitEvent("punto", "compartir_twitter", this.currentPlace.pk);
    }
    whatsappOpened(param: any):void{
        this.tracker.emitEvent("punto", "compartir_whatsapp", this.currentPlace.pk);
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
    getFullName(item: any, index: number): string {
        var fullname = item.name;
        return fullname;
    }
    changeFotos(event:any):void{

            const modalRef = this.modalService.open(PlaceImageEditionComponent);
            console.dir(this.currentPlace.images);
            this.visible = false;
            modalRef.componentInstance.place = this.currentPlace;
            modalRef.componentInstance.done.subscribe((newPlace:any) => {
                console.log("subscripto al done");
                this.currentPlace = newPlace;
                this.galleryImages = this.initGallery();
                this.tracker.emitEvent("punto", "modificar_fotos", this.currentPlace.pk);

            })

    }

    ngOnInit() {
        console.log("PlaceDetailComponent oninit");
      // this.initFacebook();
        var that = this;
        this.categoryService
            .getCategories()
            .then(categories => {
                this.categories = categories;
                this.categoryNames =  categories.map(this.getFullName);

            });

        console.log("names " + this.categoryNames);
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
                imageAnimation: NgxGalleryAnimation.Slide,
                imageSwipe: true,
                previewSwipe: true
            },
            // max-width 400
            {
                breakpoint: 400,
                width: '100%',
                height: '330px',
                imageSwipe: true,
                previewSwipe: true
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
    getCategoryByName(name: string): Category {
        return this.categories.find(x => x.name == name );
    }

}
