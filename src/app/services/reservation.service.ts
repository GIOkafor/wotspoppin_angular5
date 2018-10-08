import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BottleServiceComponent } from '../bottle-service/bottle-service.component';

/*
	This service handles everything related to reservations
*/

@Injectable()
export class ReservationService {

  constructor(
  	private db: AngularFireDatabase) { }

  newBottleServiceReservation(usr, ordr, venu, dat, gues, fn){

  	//create object to be stored
  	let reservation = {
						user: usr,
						venue: venu,
						order: ordr,
						date: dat,
						guests: gues,
            type: 'Bottle Service'
	  };

	//store in venue database
	this.db.list('reservations')
		.push(reservation)
			.then(_=> {
				//console.log("Record added successfully");
				//close dialog and show success snackbar function callback
				fn();
			});
  }

  //gets reservations for a particular user
  getUserReservations(uid){
  	return this.db.list('reservations', ref => ref.orderByChild('user').equalTo(uid))
  		.snapshotChanges();
  }


  //gets reservations for a particular venue
  getVenueReservations(id){
  	return this.db.list('reservations', ref => ref.orderByChild('venue').equalTo(id))
  		.snapshotChanges();
  }


  //get minimum order value specified by venue
  getMinSpend(key){
    return this.db.object('Venues/' + key + '/minimumSpendPerOrder').valueChanges();
  }
}
