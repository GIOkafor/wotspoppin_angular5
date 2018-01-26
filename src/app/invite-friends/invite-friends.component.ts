import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { BuddiesService } from '../services/buddies.service';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invite-friends',
  templateUrl: './invite-friends.component.html',
  styleUrls: ['./invite-friends.component.css']
})

//this component is used for both friend invitations and messaging user
export class InviteFriendsComponent implements OnInit {

  buddies: any;
  @Input() event;

  constructor(
  	private location: Location,
    private router: Router,
  	private buddiesSvc: BuddiesService,
  	private db: AngularFireDatabase,
  	private authSvc: AuthService,
    public activeModal: NgbActiveModal) { 
  		this.buddies = this.db.list('Users/' + this.authSvc.getCurrentUser().uid + '/buddies').snapshotChanges();
  }

  ngOnInit() {
  }

  goBack(){
  	this.location.back();
  }

  inviteUser(uid){
  	//send notification to user
    //add {userUID, event} to sent invites
    //which triggers cloud function
    //console.log({user: uid, event: this.event.key});

    this.db.list('Users/' + this.authSvc.getCurrentUser().uid + '/sentInvites/' + this.event.key)
      .push({user: uid, event: this.event.key})
      .then(_=> {
        //switch to popup confirming success
        console.log("push successfull");
        //this action should trigger cloud function that adds invite to a users notification screen
      });

  }

  //delete invite from my sent invites 
  //trigger cloud function to retract user invite
  cancelInviteUser(uid){
    console.log("Cancelling event invite to user: ", uid);
  }

  //select user to me messaged
  selectUser(user){
    console.log("Selected user: ", user);

    //close modal
    this.activeModal.close();

    //navigate to messages/new message view 
    this.router.navigate(['/messages', user]);
  }

}
