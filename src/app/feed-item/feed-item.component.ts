import { Component, OnInit, Pipe } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.css']
})
export class FeedItemComponent implements OnInit {

  media: any;
  mediaKey: any;

  constructor(
  	private router: Router,
  	private location: Location,
  	private route: ActivatedRoute,
  	private db: AngularFireDatabase,
  	private authSvc: AuthService,
  	private uploadSvc: UploadService,
    private snackBar: MatSnackBar) { 
  		//store media key for db manipulation functions
  		this.route.paramMap.subscribe((params:ParamMap) => this.mediaKey = params.get('id'));
  }

  ngOnInit() {
  	this.route.paramMap
  		.switchMap((params: ParamMap) => 
  			this.db.object('uploads/' + params.get('id')).valueChanges())
  			.subscribe(media => this.media = media);
  }

  likeMedia(){
    //check if user is signed in first
    if(this.authSvc.checkUserAuth()){
    	var currentUserUid = this.authSvc.getCurrentUser().uid;
    	var users = this.media.likes.users;
    	//console.log(users);

    	//check if user has liked image already
    	for(var user in users) {
    		//console.log("User is: ", user);

    		if(users[user].uid === currentUserUid){
    			//console.log("User already liked photo");
    			return		
    		}else{
    			//console.log("Liking photo");
    		}

    	}

    	//update count in view
    	this.media.likes.count++;
    	//update count in db
    	this.db.object('uploads/' + this.mediaKey + '/likes').update({count: this.media.likes.count});

    	//add user who liked to list of users that liked photo
    	this.db.list('uploads/' + this.mediaKey + '/likes/users').push({uid: currentUserUid});
    }
  }

  postComment(comment){
    //check if user is signed in first
    if(this.authSvc.checkUserAuth()){
  	  this.uploadSvc.postComment(this.mediaKey, comment);
    }
  }

  goBack(){
  	this.location.back();
  }

  //checks to see if media has been already been liked
  ifLiked(item){

    if(this.authSvc.checkUserAuth()){
      var currentUserUid = this.authSvc.getCurrentUser().uid;

      var users = item.likes.users;
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

  unlike(media){
    var currentUserUid = this.authSvc.getCurrentUser().uid;
    var users = media.likes.users;

    //update count in view
    media.likes.count --;
    //console.log(media.val.likes.users);

    for(var user in users){
      //console.log('uploads/' + media.key + '/likes/users/' + user);

      if(users[user].uid == currentUserUid){
        console.log("Removing user: ", currentUserUid);
        //remove user from list of users that liked photo
        this.db.list('uploads/' + this.mediaKey + '/likes/users/', ref => ref.orderByChild('uid').equalTo(currentUserUid))
          .snapshotChanges()
            .subscribe(res => {
              this.db.list('uploads/' + this.mediaKey + '/likes/users/').remove(res[0].key);
            });
      }
    }

    //update count in db with new values
    this.db.object('uploads/' + this.mediaKey + '/likes').update({count: media.likes.count});
  }
}
