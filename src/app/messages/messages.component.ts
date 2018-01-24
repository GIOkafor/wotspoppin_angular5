import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { InviteFriendsComponent } from '../invite-friends/invite-friends.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(
  	private location: Location,
  	private modalSvc: NgbModal) { }

  ngOnInit() {
  }

  goBack(){
  	this.location.back();
  }

  newMessage(){
  	console.log("Trigger new message popup");

  	//const modalRef = this.modalSvc.open(InviteFriendsComponent);
  }

}
