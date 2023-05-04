import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {CognitoService} from "../../services/cognito.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit
{
  user: User | undefined;
  alertMessage: string = "";
  showAlert: boolean = false;
  
  isForgotPassword: boolean = false;
  newPassword: string = "";
  
  constructor(private router:Router, private cognitoService : CognitoService) {}
  
  ngOnInit()
  {
    this.user = {} as User;
  }
  
  SignIn()
  {
    if(this.user && this.user.email && this.user.password)
      this.cognitoService.signIn(this.user)
      .then(() =>
      {
        this.router.navigate(["/"]);
      })
      .catch((error: any) =>
      {
        this.displayAlert(error.message);
      });
    else
      this.displayAlert("E-mail or password not valid.");
  }
  
  private displayAlert(message:string)
  {
    this.alertMessage = message;
    this.showAlert = true;
  }
}
