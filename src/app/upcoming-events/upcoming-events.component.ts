import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-upcoming-events',
  templateUrl: './upcoming-events.component.html',
  styleUrls: ['./upcoming-events.component.css']
})
export class UpcomingEventsComponent implements OnInit {

  userEvents: any;

  constructor(
  	private router: Router,
  	private authSvc: AuthService,
  	private db: AngularFireDatabase) { 
  		this.userEvents = db.list('Users/'+ authSvc.getCurrentUser().uid + '/upcoming-events').snapshotChanges();
  }

  ngOnInit() {
  }

  getEventDetails(key){
  	//console.log(key);

  	this.router.navigate(['event-details', key]);
  }

}
