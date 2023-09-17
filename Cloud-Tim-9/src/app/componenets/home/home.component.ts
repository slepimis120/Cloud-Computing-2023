import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {CognitoService} from 'src/app/services/cognito.service';
import {Album} from 'src/app/models/album';
import {HttpClient, HttpHeaders, HttpRequest, HttpResponse} from "@angular/common/http";
import {catchError, filter, map} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  protected selectedFile: File | null = null;
  protected description: string = '';
  protected tags: string = '';
  protected file64: string = '';
  protected filename: string = '';
  alertMessage: string = "";
  showAlert: boolean = false;
  albumlist: Album[] = [];
  albumnamelist: string[] = [];
  selectedAlbumSting: Album | undefined;

  

  constructor(private router: Router, private cognitoService: CognitoService, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getUserDetails();
    this.getAlbums();
  }

  private getAlbums(){
    const albumbrequest = {
      Name: history.state.data
    }

    this.http.post<Album[]>("/release/albumdetails/", albumbrequest)
    .subscribe(
      response => {
        this.albumlist = response;
        this.albumnamelist = this.albumlist.map(x => x.Name)
        console.log(response[0]);
      },
      error => {
        this.displayAlert(error.message);
      }
    );
    
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
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFile);
      reader.onload = () => {
        this.file64 = <string>reader.result;
        this.http.put("/release/mediafiles", this.file64, {responseType: 'text'})
        .subscribe(
          response => {
            this.filename = response;
            if(this.selectedFile){
              console.log(this.selectedAlbumSting?.Name)
              const request = {
                Name: this.filename,
                FileName: this.selectedFile.name,
                SizeKb: this.selectedFile.size,
                Type: this.selectedFile.type,
                DateLastModified: this.selectedFile.lastModified.toLocaleString(),
                DateCreated: Date.now().toLocaleString(),
                Description: this.description,
                Tags: this.tags.split(",").map(function(item) {
                  return item.trim();
                }),
                Uploader: history.state.data,
                Album: this.selectedAlbumSting?.Name
              }
              this.http.post("/release/filedetails/", request, {responseType: 'text'})
                .subscribe(
                  response => {
                    this.displayAlert(response);
                  },
                  error => {
                    this.displayAlert(error.message);
                  }
                );
            }
          },
          error => {
            this.displayAlert(error.message);
          }
        );
      };
    }
  }

  private displayAlert(message:string)
  {
    this.alertMessage = message;
    this.showAlert = true;
  }
}
