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

  constructor(
  	private db: AngularFireDatabase,
  	private authSvc: AuthService) { 
  		var currentUser = this.authSvc.getCurrentUser();
  		this.invites = db.list('Users/' + currentUser.uid + '/notifications/invites').snapshotChanges();
  }

  ngOnInit() {
  }

}
