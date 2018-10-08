import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InviteFriendsComponent } from '../invite-friends/invite-friends.component';

//import required services
import { AuthService } from '../services/auth.service';
import { MessagingService } from '../services/messaging.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

	event: any; //since we're reusing the invite to event component, this has to be included or else it crashes
  userUID: string;
  messages: any;

  constructor(
  	private location: Location,
  	private modalSvc: NgbModal,
    private authSvc: AuthService,
    private msgSvc: MessagingService) { 
  		
      this.event = 'message'; // set this to message so we can re-use invite component

      this.userUID = authSvc.getCurrentUser().uid;
      this.getMessages();
  }

  ngOnInit() {
  }

  goBack(){
  	this.location.back();
  }

  newMessage(){
  	//console.log("Trigger new message popup");

  	const modalRef = this.modalSvc.open(InviteFriendsComponent);
  	modalRef.componentInstance.event = this.event;
  }

  //gets all messages belonging to particular user
  getMessages(){
    console.log("Getting msgs for user id: ", this.userUID);
    //gets user messages
    this.messages = this.msgSvc.getMessages(this.userUID);
  }

}
