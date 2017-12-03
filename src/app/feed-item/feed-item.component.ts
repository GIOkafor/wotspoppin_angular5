import { Component, OnInit, Pipe } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';

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
  	private uploadSvc: UploadService) { 
  		//store media key for db manipulation functions
  		this.route.paramMap.subscribe((params:paramMap) => this.mediaKey = params.get('id'));
  }

  ngOnInit() {
  	this.route.paramMap
  		.switchMap((params: ParamMap) => 
  			this.db.object('uploads/' + params.get('id')).valueChanges())
  			.subscribe(media => this.media = media);
  }

  likeMedia(media){
  	//console.log("Liking media: ", this.mediaKey);

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

  postComment(comment){
  	//console.log("Comment is : ", comment);
  	this.uploadSvc.postComment(this.mediaKey, comment);
  }

  goBack(){
  	this.location.back();
  }

}
