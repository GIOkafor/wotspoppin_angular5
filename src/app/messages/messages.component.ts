import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InviteFriendsComponent } from '../invite-friends/invite-friends.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

	event: any; //since we're reusing the invite to event component, this has to be included or else it crashes

  constructor(
  	private location: Location,
  	private modalSvc: NgbModal) { 
  		this.event = 'message'; // set this to message so we can re-use invite component
  }

  ngOnInit() {
  }

  goBack(){
  	this.location.back();
  }

  newMessage(){
  	console.log("Trigger new message popup");

  	const modalRef = this.modalSvc.open(InviteFriendsComponent);
  	modalRef.componentInstance.event = this.event;
  }

}
