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

  constructor(
  	private db: AngularFireDatabase,
  	private activeModal: NgbActiveModal,
  	private authSvc: AuthService) { 
  		this.buddies = this.db.list('Users/' + authSvc.getCurrentUser().uid + '/buddies').valueChanges();
  		this.currentUser = authSvc.getCurrentUser().uid;
  }

  ngOnInit() {
  	this.guestlist = this.db.list('Events/' + this.event.key + '/guestlist').snapshotChanges();
  }

  addFriend(user){
  	console.log("Sending request to user: ", user);

  	let req = {from: this.authSvc.getCurrentUser().uid};

  	//send friend request to user
  	this.db.list('Users/' + user + '/notifications/friend-requests')
  		.push(req);
  }

  //checks if user is a friend already
  isBuddy(user){
  	var i;

  	//consider using array instead will have to see how new buddies are added i.e as array or object
  	for(i = 0; i < this.buddies.length; i++){
  		if (this.buddies[i] === user.uid)
  			return true;
  	}

  	return false;
  }

}
