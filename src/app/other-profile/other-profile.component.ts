import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Route } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { UserMediaService } from '../services/user-media.service';
import { BuddiesService } from '../services/buddies.service';
import { AuthService } from '../services/auth.service';
import { UploadService } from '../services/upload.service';
import { MatSnackBar } from '@angular/material';
import { Upload } from '../classes/upload';

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
  currentUserBuddies: any; //for keeping track of auth'ed user's friends
  buddyRequests: any;
  currentUpload: Upload;
  selectedFiles: FileList;

  constructor(
  	private location: Location,
  	private activeRoute: ActivatedRoute,
  	private db: AngularFireDatabase,
  	private userMedSvc: UserMediaService,
  	private buddiesSvc: BuddiesService,
    private authSvc: AuthService,
    private uploadSvc: UploadService,
    private snackBar: MatSnackBar) { 
      this.currentUser = authSvc.getCurrentUser();//currently signed in user
      this.getBuddies(this.currentUser.uid);
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

              this.buddiesSvc.getBuddyRequests(this.currentUser.uid)
                .subscribe(res => {
                  this.buddyRequests = res;
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

      //get updated values from db and store in loc storage
      this.db.object('Users/' + this.currentUser.uid + '/userInfo').valueChanges()
        .subscribe(res => {
          let userInfo:any = res;

          //update local storage with new user information
          var latestUser = {
            uid: this.currentUser.uid,
            photoURL: userInfo.imageUrl,
            displayName: userInfo.displayName
          };

          this.authSvc.updateLocStor(latestUser);
        });

    })
    .catch(err => {
      this.snackBar.open('Form is incomplete', '', {duration: 3000})
    });

  }

  //for detecting when user selects image from their device then calls photo upload function
  detectFiles(event) {
    //console.log("Detected event: ", event);

    this.selectedFiles = event.target.files;

    //call upload single after file is selected
    this.uploadSingle();
  }

  uploadSingle() {
    //doesn't let user upload photo unless they have an account
    if(this.authSvc.checkUserAuth()){
      let file = this.selectedFiles.item(0)

      if(file){
        this.currentUpload = new Upload(file);
        
        this.uploadSvc.profileUpload(this.currentUpload, (res)=>{
          console.log("Upload url is: ", res);

          //update current user imageUrl based on db reference
          //CHECK if this updates local storage as well because page refreshes below
          let userUp = this.db.object('Users/' + this.currentUser.uid + '/userInfo').update({imageUrl: res});
          
          userUp.then(_=> {
            this.snackBar.open("Image change successfull, reloading page...", "", {duration: 3000});
            //location.reload();
          });
          
        });
      }else{
        console.log("No file chosen");
      }
    }
  }

  //gets current user's friends
  getBuddies(uid){
    //console.log("getting buddies for user: ", uid);

    this.buddiesSvc.getUserBuddies(uid)
      .subscribe(res => this.currentUserBuddies = res);
  }

  //checks if user uid passed is currently one of my friends
  isFriend(user){
    //console.log("checking if user: " + user + " is a friend");

    var i;

    //it takes a while for results to come in from realtime db, this prevents app from crashing and only triggers when there is data to display
    if(this.currentUserBuddies !== undefined){
      for(i = 0; i < this.currentUserBuddies.length; i++){
        if (this.currentUserBuddies[i] === user)
          return true;
      }

      return false;
    }
  }

  //send friend request to user with uid
  addFriend(uid){
    console.log("Sending request to user: ", uid);

    let req = {from: this.authSvc.getCurrentUser().uid};

    if(this.isRequested(uid)){
      return;
    }else{
      //send friend request to user
      this.db.list('Users/' + uid + '/notifications/friend-requests')
        .push(req);

      //add user to requested list
      this.db.list('Users/' + this.currentUser.uid + '/sent-friend-requests')
        .push(uid);
    }

  }

  //checks to see if request has been sent to user already
  //return either true or false
  isRequested(user):boolean{
    var i;

    //it takes a while for results to come in from realtime db, this prevents app from crashing and only triggers when there is data to display
    if(this.buddyRequests !== undefined){
      for(i = 0; i < this.buddyRequests.length; i++){
        if(this.buddyRequests[i] === user){
          //console.log("User is a match: ", this.buddyRequests[i]);
          return true;
        }
      }

      return false;
    }
  }

  removeFriend(uid){
    console.log("Removing friend: " + uid);
  }
}
