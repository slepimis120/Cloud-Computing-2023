import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CognitoService} from 'src/app/services/cognito.service';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {catchError, filter} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  protected selectedFile: File | null = null;

  constructor(private router: Router, private cognitoService: CognitoService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getUserDetails();
  }

  private getUserDetails() {
    this.cognitoService.getUser()
      .then((user: any) => {
        if (user) {

        } else {
          this.router.navigate(['/sign-in']);
        }
      })
  }

  signOutWithCognito() {
    this.cognitoService.signOut()
      .then(() => {
        this.router.navigate(['/sign-in'])
      })
  }

  handleFileInput(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }

  onUpload() {
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile);
      console.log(this.selectedFile.name);
      console.log(formData);
      this.http.put('/KT1/cloud-tim9-mediafiles/test5.png', formData)
        .subscribe(
          response => {
            console.log(response);
            // Handle the response
          },
          error => {
            console.log(error);
            // Handle the error
          }
        );
    }
  }


}
