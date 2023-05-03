import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SignUpComponent } from './componenets/sign-up/sign-up.component';
import { AppRoutingModule } from './app-routing.module';
import { MessageModalComponent } from './componenets/message-modal/message-modal.component';
import { HomeComponent } from './componenets/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    SignUpComponent,
    MessageModalComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
