import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componenets/home/home.component';
import { SignInComponent } from './componenets/sign-in/sign-in.component';
import { SignUpComponent } from './componenets/sign-up/sign-up.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'sign-in',component:SignInComponent},
  {path:'sign-up', component:SignUpComponent},
  {path:"**", component:SignInComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }