import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule}   from '@angular/forms';
import {HttpModule}    from '@angular/http';
import {AppRoutingModule} from './app-routing.module';
import {BusyModule}              from 'angular2-busy';
import {AppComponent}         from './app.component';
import {PlaceFormComponent}   from './place-form.component';
import {PlaceImageEditionComponent}   from './place-image-edition.component';
import {PlaceService}         from './place.service';
import {CategoryService}      from './category.service';
import {AboutComponent} from './about/about.component';
import {HelpComponent} from './help/help.component';
import {MainComponent}        from './main.component';
import {MapComponent}         from './map.component';
import {NgbModule}            from '@ng-bootstrap/ng-bootstrap';
import {ImageUploadModule}    from "angular2-image-upload"
import {TestComponent}         from './test.component';
import {CreatePointComponent}         from './create-point.component';
import {PlaceDetailComponent}         from './place-detail.component';
import {LayerService}         from './layer.service';
import {LayerComponent}         from './layer.component';
import {PathComponent}         from './path.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './auth/login.component';
import {RegisterComponent} from './auth/register.component';
import {ResetPasswordComponent} from './auth/resetPassword.component';
import {AuthenticationService} from './auth/authentication.service';
import {UserComponent}         from './user.component';
import {MessageComponent}         from './message.component';
import {LoginRequiredComponent}         from './loginRequired.component';
import {NgxGalleryModule} from 'ngx-gallery';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {MapService}         from './map.service';
import {FacebookModule} from 'ngx-facebook';
import {NdvEditAreaComponent} from './angular2-click-to-edit/ndv.edit.area.component';
import {NdvEditSelectComponent} from './angular2-click-to-edit/ndv.edit.select.component';
import {TrackerService} from "./tracker.service";
import {VoteService} from "./vote.service";

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
    FacebookModule.forRoot()
  ],
  declarations: [
    AppComponent,
    MainComponent,
    MapComponent,
    AboutComponent,
    HelpComponent,
    PlaceFormComponent,
    PlaceImageEditionComponent,
    TestComponent,
    CreatePointComponent,
    PlaceDetailComponent,
    LayerComponent,
    PathComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    UserComponent,
    MessageComponent,
    LoginRequiredComponent,
    NdvEditAreaComponent,
    NdvEditSelectComponent
  ],
  providers: [ PlaceService, CategoryService, LayerService,
    AuthenticationService, MapService, TrackerService, VoteService],
  bootstrap: [ AppComponent ],
  exports :   [NgbModule],
  entryComponents: [
    PlaceFormComponent,
    AboutComponent,
    HelpComponent,
    TestComponent,
    CreatePointComponent,
    PlaceDetailComponent,
    LayerComponent,
    PathComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    UserComponent,
    MessageComponent,
    LoginRequiredComponent,
    PlaceImageEditionComponent
    ]

})
export class AppModule { }
