import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent }         from './app.component';
import { PlaceFormComponent }   from './place-form.component';
import { PlaceService }         from './place.service';
import { CategoryService }      from './category.service';
import { AboutComponent }       from './about.component';
import { MainComponent }        from './main.component';
import { MapComponent }         from './map.component';
import { NgbModule }            from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadModule }    from "angular2-image-upload"
import { TestComponent }         from './test.component';
import { CreatePointComponent }         from './create-point.component';
import { PlaceDetailComponent }         from './place-detail.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ImageUploadModule.forRoot(),

  ],
  declarations: [
    AppComponent,
    MainComponent,
    MapComponent,
    AboutComponent,
    PlaceFormComponent,
    TestComponent,
    CreatePointComponent,
    PlaceDetailComponent
  ],
  providers: [ PlaceService, CategoryService ],
  bootstrap: [ AppComponent ],
  exports :   [NgbModule],
  entryComponents: [PlaceFormComponent, AboutComponent, TestComponent, CreatePointComponent,PlaceDetailComponent]

})
export class AppModule { }
