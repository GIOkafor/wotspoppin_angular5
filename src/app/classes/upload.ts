export class Upload {

  $key: string;
  file:File;
  name:string;
  url:string;
  progress:number;
  createdAt: Date = new Date();
  displayName: string;
  likes: any;
  comments: any;
  userUid: any;
  
  constructor(file:File) {
    this.file = file;
  }
}
