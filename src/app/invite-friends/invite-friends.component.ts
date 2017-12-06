import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BuddiesService } from '../services/buddies.service';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.css']
})
export class InviteFriendsComponent implements OnInit {

  buddies: any;

  constructor(
  	private location: Location,
  	private buddiesSvc: BuddiesService,
  	private db: AngularFireDatabase,
  	private authSvc: AuthService) { 
  		this.buddies = this.db.list('Users/' + this.authSvc.getCurrentUser().uid + '/buddies').snapshotChanges();
  }

  ngOnInit() {
  }

  goBack(){
  	this.location.back();
  }

  inviteUser(uid){
  	console.log("Inviting user with uid: ", uid);
  	//send notification to user
  	//this should trigger cloud function that adds invite to a users notification screen
  }

}
