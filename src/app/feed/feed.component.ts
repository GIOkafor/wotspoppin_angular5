import { Component, OnInit } from '@angular/core';
import { Upload } from '../classes/upload';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  currentUpload: Upload;
  selectedFiles: FileList;

  constructor(private upSvc: UploadService) { 
  	
  }

  ngOnInit() {
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;

    //call upload single after file is selected
    this.uploadSingle();
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0)

    if(file){
	    this.currentUpload = new Upload(file);
	    this.upSvc.pushUpload(this.currentUpload)
	}else{
		console.log("No file chosen");
	}

  }

  uploadPhoto(){
  	console.log("Uploading photo");
  }

  uploadVideo(){
  	console.log("Uploading video");
  }

  likeMedia(){
  	//
  }

  commentOnMedia(){
  	//
  }

}
