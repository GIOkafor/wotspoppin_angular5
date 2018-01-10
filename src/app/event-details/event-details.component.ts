import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InviteFriendsComponent } from '../invite-friends/invite-friends.component';
import 'rxjs/add/operator/switchMap';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  event: any;
  attending: boolean = false;
  maybe: boolean;

  constructor(
  	private db: AngularFireDatabase,
  	private route: ActivatedRoute,
  	private location: Location,
  	private authSvc: AuthService,
  	private router: Router,
    private modalSvc: NgbModal,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  	this.route.paramMap
	  	.switchMap((params: ParamMap) => 
	        this.db.object('Events/'+params.get('id')).snapshotChanges())
	        .subscribe(
	          (event: any) => {
	            this.event = event;
	            this.checkIfAttending();
	          });
  }

  goBack(){
  	this.location.back();
  }

  //checks guest list to see if user is attending event
  checkIfAttending(){
  	console.log(this.event.payload.val().guestlist);

    //check if guestlist exists first, new events don't have guestlist object yet because no one has rsvpd
    if(!this.event.payload.val().guestlist){
      console.log("No guest list for event");
      return;
    }

  	for(var user in this.event.payload.val().guestlist){
  		if (this.event.payload.val().guestlist[user] === this.authSvc.getCurrentUser().uid)
  			this.attending = true;
  	}
  }

  attendEvent(){
  	
    //check if user is authenticated first
    if(this.authSvc.checkUserAuth()){ 
      console.log("Adding you to guest list");

      //process payment and

      //add user to guestlist in db
      this.db.list('Events/' + this.event.payload.key + '/guestlist').push(this.authSvc.getCurrentUser().uid);

      //remove useless bits of info before adding event details to user portion of db
      let ev = {
        name: this.event.payload.val().name,
        date: this.event.payload.val().date
      };

      //add event to user upcoming events
      this.db.object('Users/' + this.authSvc.getCurrentUser().uid + '/upcoming-events/' + this.event.payload.key).update(ev);

      this.maybe = false;
      this.attending = true;
    }
  }

  mayBe(){
    if(this.authSvc.checkUserAuth()){	
      console.log("Adding you to maybe list");
    	this.maybe = true;
    }
  }

  //change to modal toggle
  inviteFriends(){
  	if(this.authSvc.checkUserAuth()){
      const modalRef = this.modalSvc.open(InviteFriendsComponent);
      modalRef.componentInstance.event = this.event;
    }
  }

}
