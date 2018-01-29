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

        //add myself to user buddies node
        this.db.list('Users/' + req.payload.val().from + '/buddies')
          .push(this.authSvc.getCurrentUser().uid);

        //clear request from pending requests view
        this.dismissRequest(req);
      })
  }

  reject(req){
    this.dismissRequest(req);
  }

  //clears friend request from queue
  dismissRequest(req){
    //clear this request from sender's pending requests node
    this.db.list('Users/' + req.payload.val().from + '/sent-friend-requests', ref => ref.orderByValue().equalTo(this.authSvc.getCurrentUser().uid))
      .snapshotChanges().subscribe(res => {
        console.log("Deleting key: ", res[0].key);

        this.db.list('Users/' + req.payload.val().from + '/sent-friend-requests').remove(res[0].key);
      });
     
    //remove friend request from my requests node 
    const promise = this.db.list('Users/'+ this.authSvc.getCurrentUser().uid + '/notifications/friend-requests')
      .remove(req.key);

    promise.then(_=>console.log("Request cleared"));

  }

  //clears event invite from queue
  dismissEventNotification(invite){
    //console.log("Dismissing event: ", invite.key);

    //clear request from my event invites queue
    this.db.list('Users/' + this.authSvc.getCurrentUser().uid + '/notifications/invites').remove(invite.key);

    //clear event from sender's queue
    //consider scheduling cloud function to do this as upkeep
    //find request in db where from == senderid and delete
    this.db.list('Users/' + invite.payload.val().from + '/sentInvites/', ref => ref.orderByKey().equalTo(invite.payload.val().event))
      .valueChanges().subscribe(res => {
        for (var i in res[0]){
          //console.log(res[0][i]);
          if(res[0][i].user === this.authSvc.getCurrentUser().uid){
            //console.log("Deleting key: ", i);
            this.db.list('Users/' + invite.payload.val().from + '/sentInvites/' + invite.payload.val().event).remove(i);
          }
        }
      });
  }
}
