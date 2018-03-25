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

  newBottleServiceReservation(usr, ordr, venue, dat, gues){
  	
  	//create object to be stored
  	let reservation = {
						user: usr,
						order: ordr,
						date: dat,
						guests: gues
					  };

	//store in venue database
	this.db.list('/Venues/'+venue+'/reservations')
		.push(reservation)
			.then(_=> {
				console.log("Record added successfully");
				//close dialog
			});
  }

}
