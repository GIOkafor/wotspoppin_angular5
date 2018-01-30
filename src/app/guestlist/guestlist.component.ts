import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-guestlist',
  templateUrl: './guestlist.component.html',
  styleUrls: ['./guestlist.component.css']
})
export class GuestlistComponent implements OnInit {

  guestlist: any;
  buddies: any;
  @Input() event;
  currentUser: any;
  buddyRequests: any;

  constructor(
  	private db: AngularFireDatabase,
  	private activeModal: NgbActiveModal,
  	private authSvc: AuthService) { 
  		this.currentUser = authSvc.getCurrentUser().uid;
      this.buddies = this.db.list('Users/' + this.currentUser + '/buddies').valueChanges()
        .subscribe(res => {
          this.buddies = res;
        })
  }

  ngOnInit() {
  	this.guestlist = this.db.list('Events/' + this.event.key + '/guestlist').snapshotChanges();

    this.db.list('Users/' + this.currentUser + '/sent-friend-requests').valueChanges()
      .subscribe(res => {
        this.buddyRequests = res;
      });
  }

  addFriend(user){
  	console.log("Sending request to user: ", user);

  	let req = {from: this.authSvc.getCurrentUser().uid};

    if(this.isRequested(user)){
      return;
    }else{
      //send friend request to user
      this.db.list('Users/' + user + '/notifications/friend-requests')
        .push(req);

      //add user to requested list
      this.db.list('Users/' + this.currentUser + '/sent-friend-requests')
        .push(user);
    }

  }

  //checks if user is a friend already
  //return either true/false
  //for toggling icon
  isBuddy(user){
  	var i;

  	//it takes a while for results to come in from realtime db, this prevents app from crashing and only triggers when there is data to display
    if(this.buddies !== undefined){
    	for(i = 0; i < this.buddies.length; i++){
    		if (this.buddies[i] === user)
    			return true;
    	}

  	  return false;
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

  //close modal
  closeModal(){
    this.activeModal.close();
  }

}
