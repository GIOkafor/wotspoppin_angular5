import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

//import required services
import { AuthService } from '../../services/auth.service';
import { MessagingService } from '../../services/messaging.service';

@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.css']
})
export class MessageDetailsComponent implements OnInit {

	userUID: string;
	threadId: string;
	messages: any;
  message: any = '';

  constructor(
  	private location: Location,
  	private route: ActivatedRoute,
  	private authSvc: AuthService,
  	private msgSvc: MessagingService) { 
  		this.userUID = authSvc.getCurrentUser().uid;
  }

  ngOnInit() {
  	this.threadId = this.route.snapshot.paramMap.get('id');
	//console.log(this.threadId);

	this.getMessages();
  }

  goBack(){
  	this.location.back();
  }

//gets messages in particular thread
//refactor to get particular thread
  getMessages(){
  	//console.log("Getting msgs for user id: ", this.userUID);
  	//gets user messages
  	this.messages = this.msgSvc.getThreadMessages(this.userUID, this.threadId);
  }

//send message to user in thread 
  sendMessage(msg){
  	//console.log("Sending message: ", msg);

  	let message = {
  		text: msg,
  		senderId: this.authSvc.getCurrentUser().uid
  	}

  	this.msgSvc.addMessage(this.userUID, this.threadId, message);
  }


}
