import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  myEvents: any;
  currentUserUid: any;

  constructor(
  	private db: AngularFireDatabase,
  	private authSvc: AuthService) { 
  		this.currentUserUid = this.authSvc.getCurrentUser().uid;

  		this.getMyEvents(this.currentUserUid);
  }

  ngOnInit() {
  }

  //get events created by auth'd user
  getMyEvents(uid){
  	//console.log("Getting your events ...");

  	this.db.list('Events/', ref => ref.orderByChild('createdBy').equalTo(uid))
  		.snapshotChanges()
  			.subscribe(res => {
  				//console.log(res);

  				this.myEvents = res;
  			});
  }

}
