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

  //checks to see if media has been already been liked
  ifLiked(item){

    if(this.authSvc.checkUserAuth()){
      var currentUserUid = this.authSvc.getCurrentUser().uid;

      var users = item.val.likes.users;
        //console.log(users);
      
      //check if user has liked image already
      for(var user in users) {
        //console.log("User is: ", user);

        if(users[user].uid === currentUserUid){
          return true;   
        }
      }

      return false;
    }else{
      return false; //if user is not authenticated, return false as you need account to interact with media
    }
  }

  //BUGGGY AF!
  //NEVER CALL THIS DIRECTLY only call inside likeMedia(media)
  unlike(media){
    var currentUserUid = this.authSvc.getCurrentUser().uid;
    var users = media.val.likes.users;

    //update count in view
    media.val.likes.count --;
    //console.log(media.val.likes.users);

    for(var user in users){
      //console.log('uploads/' + media.key + '/likes/users/' + user);

      if(users[user].uid == currentUserUid){
        console.log("Removing user: ", currentUserUid);
        //remove user from list of users that liked photo
        this.db.list('uploads/' + media.key + '/likes/users/', ref => ref.orderByChild('uid').equalTo(currentUserUid))
          .snapshotChanges()
            .subscribe(res => this.db.list('uploads/' + media.key + '/likes/users/').remove(res[0].key));
      }
    }

    //update count in db with new values
    this.db.object('uploads/' + media.key + '/likes').update({count: media.val.likes.count});
  }

  likeMedia(media){
    //check if user is signed in first
    if(this.authSvc.checkUserAuth()){
    
      //console.log("Liking media: ", media.key);

      var currentUserUid = this.authSvc.getCurrentUser().uid;
      var users = media.val.likes.users;
      //console.log(users);
    
      //check if user has liked image already
      for(var user in users) {
        //console.log("User is: ", user);

        if(users[user].uid === currentUserUid){
          return;    
        }
      }

      //update count in view
      media.val.likes.count++;
      //update count in db
      const promise = this.db.object('uploads/' + media.key + '/likes').update({count: media.val.likes.count});

      promise
        .then(_=> {
          console.log("Adding user to list of people that liked photo");
          //add user who liked to list of users that liked photo
          this.db.list('uploads/' + media.key + '/likes/users').push({uid: currentUserUid});
        })
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
