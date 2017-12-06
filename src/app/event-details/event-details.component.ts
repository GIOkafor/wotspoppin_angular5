import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
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
  	private router: Router) { }

  ngOnInit() {
  	this.route.paramMap
	  	.switchMap((params: ParamMap) => 
	        this.db.object('Events/'+params.get('id')).valueChanges())
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

  inviteFriends(){
  	this.router.navigate(['invite-friends']);
  }

}
