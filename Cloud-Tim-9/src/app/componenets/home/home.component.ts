import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {CognitoService} from 'src/app/services/cognito.service';
import {Album} from 'src/app/models/album';
import {FileMedia} from 'src/app/models/file'
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  protected selectedFile: File | null = null;
  protected selectedFileChange: File | null = null;
  protected description: string = '';
  protected tags: string = '';
  protected file64: string = '';
  protected filename: string = '';
  protected descriptionDownload: string = '';
  protected tagsDownload: string = '';
  alertMessage: string = "";
  showAlert: boolean = false;
  showDetails: boolean = false;
  albumlist: Album[] = [];
  albumnamelist: string[] = [];
  selectedAlbumSting: Album | undefined;
  selectedAlbumStingDownload: Album | undefined;
  selectedDeleteAlbum: Album | undefined;
  selectedGetAlbum: Album | undefined;
  albumName: string = "";
  fileList: FileMedia[] = [];
  selectedFileDownload: FileMedia | undefined;
  editableFile: FileMedia | undefined;
  

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

  handleAnotherFileInput(event: any) {
    this.selectedFileChange = event.target.files[0] as File;
  }

  onSave(){
    if(this.selectedFileChange) {
      const reader = new FileReader();
      reader.readAsDataURL(this.selectedFileChange);
      reader.onload = () => {
        this.file64 = <string>reader.result;
        const request = {
          File: this.file64,
          Name: this.selectedFileDownload?.Name,
          DateCreated: this.editableFile?.DateCreated,
          DateLastModified: Date.now().toLocaleString(),
          Description: this.descriptionDownload,
          FileName: this.selectedFileChange?.name,
          SizeKb: this.selectedFileChange?.size.toString(),
          Tags: this.tagsDownload,
          Type: this.selectedFileChange?.type,
          Uploader: history.state.data
        }
        console.log(request)
        this.http.post("/release/editfile/", request, {responseType: 'text'})
          .subscribe(
            response => {
              this.displayAlert(response);
            },
            error => {
              this.displayAlert(error.message);
            }
          );
      }
    }else{
      const request = {
        File: "none",
        Name: this.selectedFileDownload?.Name,
        DateCreated: this.editableFile?.DateCreated,
        DateLastModified: Date.now().toLocaleString(),
        Description: this.descriptionDownload,
        FileName: this.editableFile?.FileName,
        SizeKb: this.editableFile?.SizeKb,
        Tags: this.tagsDownload,
        Type: this.editableFile?.Type,
        Uploader: history.state.data
      }
      console.log(request)
      this.http.post("/release/editfile/", request, {responseType: 'text'})
          .subscribe(
            response => {
              this.displayAlert(response);
            },
            error => {
              this.displayAlert(error.message);
            }
          );
    }

      
  }

  deleteImage(){
    const request = {
      Name: this.selectedFileDownload?.Name,
      Owner: history.state.data
    }
    console.log(request)
    this.http.post("/release/delete-file/", request, {responseType: 'text'})
      .subscribe(
        response => {
          this.displayAlert(response)
        },
        error => {
          this.displayAlert(error.message);
        }
      );
  }


  onDownload(){
    const request = {
      Name: this.selectedFileDownload?.Name,
      Owner: history.state.data
    }
    console.log(request)
    this.http.post("/release/mediafiles/", request, {responseType: 'text'})
      .subscribe(
        response => {
          if(this.selectedFileDownload != undefined){
            window.open(response, "_blank");
          }
        },
        error => {
          this.displayAlert(error.message);
        }
      );
  }

  getData(file: FileMedia){
    this.editableFile = file
    this.descriptionDownload = file.Description
    this.tagsDownload = file.Tags.map(x=>x).join(", ")
    this.selectedAlbumStingDownload = this.selectedGetAlbum
    this.showDetails = true;
    this.selectedFileDownload = file;
  }

  createAlbum() {
    const request = {
      Name: this.albumName,
      Owner: history.state.data
    }
    this.http.post("/release/album/", request, {responseType: 'text'})
      .subscribe(
        response => {
          this.displayAlert(response + " The page will automatically refresh.");
          setTimeout(() => {
            location.reload();
          }, 5000);
          
        },
        error => {
          this.displayAlert(error.message);
        }
      );
  }

  getAlbum() {
    if(this.selectedGetAlbum != undefined){
      let nameList: String[] = [];
      for(let i = 0; i < this.selectedGetAlbum.Contents.length; i++){
        nameList.push(this.selectedGetAlbum.Contents[i])
      }
      const request = {
        Name: nameList,
        Album: this.selectedGetAlbum.Name
      }
      this.http.post<FileMedia[]>('/release/files', request).subscribe(
        response => {
          this.fileList = response
        },
        error => {
          console.log(error)
        }
      );
    }
  }

  deleteAlbum() {
    if(this.selectedDeleteAlbum != undefined){
      const request = {
        Name: this.selectedDeleteAlbum.Name,
        Owner: history.state.data
      }

      this.http.request('delete', '/release/album', {body: request}).subscribe(
        response => {
          this.displayAlert("Item successfully deleted! The page will automatically refresh.");
          setTimeout(() => {
            location.reload();
          }, 5000);
          
        },
        error => {
          this.displayAlert(error.message);
        }
      );
    }
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
