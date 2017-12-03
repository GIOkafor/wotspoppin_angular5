import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Upload } from '../classes/upload';
import { UploadService } from '../services/upload.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  currentUpload: Upload;
  selectedFiles: FileList;
  feedItems: Observable<any[]>;

  constructor(
    private router: Router,
    private upSvc: UploadService,
    private db: AngularFireDatabase) { 
  	
  }

  ngOnInit() {
    this.getPhotos();
  }

  //for detecting when user selects image from their device then calls photo upload function
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

  uploadVideo(){
  	console.log("Uploading video");
  }

  likeMedia(key){
  	console.log("Liking media with key: ", key);
  }

  //opens up view with media and text box so user can leave comment
  commentOnMedia(key){
  	console.log("Commenting on media with key: ", key);

    //redirect to comment page with media id iin param
    this.router.navigate(['/feed-item', key]);
  }

  //get photos from db
  getPhotos(){
    this.feedItems = this.db.list('uploads').snapshotChanges()
      .map(items => {
        return items.map(i => ({ key: i.payload.key, val: i.payload.val() }));
      });
  }

}
