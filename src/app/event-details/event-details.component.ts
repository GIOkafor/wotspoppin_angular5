import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InviteFriendsComponent } from '../invite-friends/invite-friends.component';
import 'rxjs/add/operator/switchMap';

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
    private modalSvc: NgbModal) { }

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
  	//console.log(this.event.guestlist);

    //check if guestlist exists first, new events don't have guestlist object yet because no one has rsvpd
    if(!this.event.guestlist)
      return;

  	for(var user in this.event.guestlist){
  		if (this.event.guestlist[user] === this.authSvc.getCurrentUser().uid)
  			this.attending = true;
  	}
  }

  attendEvent(){
  	console.log("Adding you to guest list");
  	this.maybe = false;
  	this.attending = true;
  }

  mayBe(){
  	console.log("Adding you to maybe list");
  	this.maybe = true;
  }

  //change to modal toggle
  inviteFriends(){
  	const modalRef = this.modalSvc.open(InviteFriendsComponent);
    modalRef.componentInstance.event = this.event;
  }

}
