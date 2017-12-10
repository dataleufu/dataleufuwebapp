import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import {BusyModule}              from 'angular2-busy';
import { AppComponent }         from './app.component';
import { PlaceFormComponent }   from './place-form.component';
import { PlaceService }         from './place.service';
import { CategoryService }      from './category.service';
import {AboutComponent} from './about/about.component';
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
import {LoginComponent} from './auth/login.component';
import {RegisterComponent} from './auth/register.component';
import { AuthenticationService } from './auth/authentication.service';
import { UserComponent }         from './user.component';
import { MessageComponent }         from './message.component';
import { NgxGalleryModule } from 'ngx-gallery';
import {ShareButtonsModule} from 'ngx-sharebuttons';



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
    ShareButtonsModule.forRoot()
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
  providers: [ PlaceService, CategoryService, LayerService, AuthenticationService ],
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
