import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppShellNoRenderModule } from './shared/directives/app-shell-no-render.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgProgressModule } from 'ngx-progressbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { firebaseConfig } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { ToastsModule } from './shared/components/toasts/toasts.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    NgbModule,
    AppShellNoRenderModule,
    NgxSpinnerModule,
    NgProgressModule,
    BrowserAnimationsModule,
    ToastsModule,
    FontAwesomeModule,
    NgbCollapseModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
