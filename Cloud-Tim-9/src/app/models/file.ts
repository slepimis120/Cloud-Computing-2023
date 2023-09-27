export class FileMedia{
    Name: string;
    DateCreated: string;
    DateLastModified: string;
    Description: string;
    FileName: string;
    SizeKb: number;
    Tags: string[];
    Type: string;
    Uploader: string;

    constructor(Name: string, DateCreated: string, DateLastModified: string, Description: string, FileName: string, SizeKb: number, Tags: string[], Type: string, Uploader: string) {
        this.Name = Name;
        this.DateCreated = DateCreated;
        this.DateLastModified = DateLastModified;
        this.Description = Description;
        this.FileName = FileName;
        this.SizeKb = SizeKb;
        this.Tags = Tags;
        this.Type = Type;
        this.Uploader = Uploader;
      }
    }
    