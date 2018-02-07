import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Route } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserMediaService } from '../services/user-media.service';
import { BuddiesService } from '../services/buddies.service';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['./other-profile.component.css']
})
export class OtherProfileComponent implements OnInit {

  user: any; //references user whose profile we are currently viewing
  postsCount: any = 0;
  friendCount: any = 0;
  currentUser: any; // refers to currently authenticated user

  constructor(
  	private location: Location,
  	private activeRoute: ActivatedRoute,
  	private db: AngularFireDatabase,
  	private userMedSvc: UserMediaService,
  	private buddiesSvc: BuddiesService,
    private authSvc: AuthService,
    private snackBar: MatSnackBar) { 
      this.currentUser = authSvc.getCurrentUser();//currently signed in user
  }

  ngOnInit() {
  	this.activeRoute.paramMap
	  	.switchMap((params: ParamMap) => 
	        this.db.object('Users/'+params.get('id')).snapshotChanges())
	        .subscribe(
	          (user: any) => {
	            this.user = user;
	            //console.log(user);

	            //get user details
	            this.userMedSvc.getUserPhotos(this.user.key)
	            	.subscribe(res => {
	            		res.forEach(_=> this.postsCount++);
	            	});

	            this.buddiesSvc.getUserBuddies(this.user.key)
	            	.subscribe(res => {
	            		res.forEach(_ => this.friendCount++);
	            	});
	          });
  }

  goBack(){
  	this.location.back();
  }

  //checks to see if currently authenticated user is the owner of account
  //which enables editing the values in the db
  checkUser(uid):boolean{
    if(uid === this.user.key)
      return true;
    else return false;
  }


  //saves changes made to user information
  save(info){
    console.log("Saving changes: ", info.value);

    const promise = this.db.object('Users/' + this.currentUser.uid + '/userInfo').update(info.value);
    promise.then(_=> {
      this.snackBar.open('Information updated successfully', '', {duration: 3000});

      //update local storage with new user information
      var latestUser = {
        uid: this.currentUser.uid,
        displayName: info.value.displayName,
        photoURL: this.currentUser.photoURL
      };

      this.authSvc.updateLocStor(latestUser);
    });

  }
}
