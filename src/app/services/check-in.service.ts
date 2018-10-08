import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class CheckInService {

  constructor(
  	private db: AngularFireDatabase,
  	private snackBar: MatSnackBar) { }

  checkIn(user, venue){
  	//console.log(user + ', ' + venue);

  	this.db.list('uploads/')
  		.push({userUid: user, goingTo: venue, type: 'checkin'})
  		.then(_=> this.snackBar.open('User checked in successfully', '', {duration: 3000}));  	
  }

  //get users that checked in 6 hours ago
  getCheckedInUsers(venue){
  	return this.db.list('uploads/', ref => ref.orderByChild('type').equalTo('checkin') && ref.orderByChild('goingTo').equalTo(venue)).snapshotChanges();
  }
}
