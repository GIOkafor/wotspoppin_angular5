import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  invites: any;
  requests: any;

  constructor(
  	private db: AngularFireDatabase,
  	private authSvc: AuthService) { 
  		var currentUser = this.authSvc.getCurrentUser();
      this.invites = db.list('Users/' + currentUser.uid + '/notifications/invites').snapshotChanges();
  		this.requests = db.list('Users/' + currentUser.uid + '/notifications/friend-requests').snapshotChanges();
  }

  ngOnInit() {
  }


  accept(req){
    console.log("accepting request: ", req.payload.val().from);

    //add user to my buddies
    const promise = this.db.list('Users/' + this.authSvc.getCurrentUser().uid + '/buddies')
      .push(req.payload.val().from);

    promise 
      .then(_=>{
        console.log("Added user successfully");
        //then clear request from queue
        this.dismissRequest(req);
      })

  }

  reject(req){
    this.dismissRequest(req);
  }

  dismissRequest(req){
    const promise = this.db.list('Users/'+ this.authSvc.getCurrentUser().uid + '/notifications/friend-requests')
      .remove(req.key);

    promise.then(_=>console.log("Request cleared"));
  }
}
