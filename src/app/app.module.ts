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
import { LayerService }         from './layer.service';
import { LayerComponent }         from './layer.component';
import { PathComponent }         from './path.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BusyModule}              from 'angular2-busy';
import {LoginComponent} from './auth/login.component';
import {RegisterComponent} from './auth/register.component';
import { AuthenticationService } from './auth/authentication.service';
import { UserComponent }         from './user.component';
import { MessageComponent }         from './message.component';
import { NgxGalleryModule } from 'ngx-gallery';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import { MetaModule } from 'ng2-meta';
import { MetaConfig, MetaService } from 'ng2-meta';

const metaConfig: MetaConfig = {
  //Append a title suffix such as a site name to all titles
  //Defaults to false
  useTitleSuffix: true,
  defaults: {
    title: 'Default title for pages without meta in their route',
    titleSuffix: ' | RadarLeufú',
    'og:image': 'http://example.com/default-image.png',
    'any other': 'arbitrary tag can be used'
  }
};

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    ImageUploadModule.forRoot(),
    BrowserAnimationsModule,
    BusyModule,
    NgxGalleryModule,
    ShareButtonsModule.forRoot(),

    MetaModule.forRoot(metaConfig)
  ],
  declarations: [
    AppComponent,
    MainComponent,
    MapComponent,
    AboutComponent,
    PlaceFormComponent,
    TestComponent,
    CreatePointComponent,
    PlaceDetailComponent,
    LayerComponent,
    PathComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    MessageComponent
  ],
  providers: [ PlaceService, CategoryService, LayerService, AuthenticationService, ],
  bootstrap: [ AppComponent ],
  exports :   [NgbModule],
  entryComponents: [
    PlaceFormComponent,
    AboutComponent,
    TestComponent,
    CreatePointComponent,
    PlaceDetailComponent,
    LayerComponent,
    PathComponent,
    LoginComponent,
    RegisterComponent,
    UserComponent,
    MessageComponent
    ]

})
export class AppModule { }
