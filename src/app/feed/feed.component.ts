import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Upload } from '../classes/upload';
import { UploadService } from '../services/upload.service';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';

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
    private db: AngularFireDatabase,
    private authSvc: AuthService,
    private snackBar: MatSnackBar) { 
  	
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
    if(this.authSvc.checkUserAuth()){
      let file = this.selectedFiles.item(0)

      if(file){
  	    this.currentUpload = new Upload(file);
  	    this.upSvc.pushUpload(this.currentUpload)
    	}else{
    		console.log("No file chosen");
    	}
    }
  }

  uploadVideo(){
  	console.log("Uploading video");
  }

  likeMedia(media){
    //check if user is signed in first
    if(this.authSvc.checkUserAuth()){
    
      console.log("Liking media: ", media.key);

      var currentUserUid = this.authSvc.getCurrentUser().uid;
      var users = media.val.likes.users;
      console.log(users);
    
      //check if user has liked image already
      for(var user in users) {
        //console.log("User is: ", user);

        if(users[user].uid === currentUserUid){
          console.log("User already liked photo");
          return    
        }else{
          console.log("Liking photo");
        }

      }

      //update count in view
      media.val.likes.count++;
      //update count in db
      this.db.object('uploads/' + media.key + '/likes').update({count: media.val.likes.count});

      //add user who liked to list of users that liked photo
      this.db.list('uploads/' + media.key + '/likes/users').push({uid: currentUserUid});
    }
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
