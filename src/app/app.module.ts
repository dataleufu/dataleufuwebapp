import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent }         from './app.component';
import { PlaceFormComponent }   from './place-form.component';
import { PlaceService }          from './place.service';
import { AboutComponent }       from './about.component';
import { MainComponent }        from './main.component';
import { MapComponent }         from './map.component';
import { NgbModule }            from '@ng-bootstrap/ng-bootstrap';
import { ImageUploadModule }    from "angular2-image-upload"


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
    PlaceFormComponent
  ],
  providers: [ PlaceService ],
  bootstrap: [ AppComponent ],
  exports :   [NgbModule],
  entryComponents: [PlaceFormComponent, AboutComponent]

})
export class AppModule { }
