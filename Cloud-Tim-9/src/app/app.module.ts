import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SignInComponent } from './componenets/sign-in/sign-in.component';
import { SignUpComponent } from './componenets/sign-up/sign-up.component';
import { AppRoutingModule } from './app-routing.module';
import { MessageModalComponent } from './componenets/message-modal/message-modal.component';
import { HomeComponent } from './componenets/home/home.component';
import {HttpClientModule} from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    MessageModalComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
