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
  protected description: string = '';
  protected tags: string = '';

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
      const fileUploadRequest: FormData = new FormData();
      fileUploadRequest.append('file', this.selectedFile);
      const request = {
        Name: this.selectedFile.name,
        SizeKb: this.selectedFile.size,
        Type: this.selectedFile.type,
        DateLastModified: this.selectedFile.lastModified.toLocaleString(),
        DateCreated: Date.now().toLocaleString(),
        Description: this.description,
        Tags: this.tags,
        Uploader: "ja"
      }

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        })
      };
      this.http.post("/release/filedetails/", request)
        .subscribe(
          response => {
            console.log(response);
          },
          error => {
            console.log(error);
          }
        );
      this.http.put("/release/mediafiles", fileUploadRequest, httpOptions)
        .subscribe(
          response => {
            console.log(response);
          },
          error => {
            console.log(error);
          }
        );
    }
  }


}
