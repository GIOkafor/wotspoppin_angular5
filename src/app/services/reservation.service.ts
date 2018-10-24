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
            type: 'Bottle Service',
            status: 'pending'
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

  getProvince(venueId): any{
    //console.log("Getting province val for venue with uid: ", venueId);
    return this.db.object('Venues/' + venueId + '/province').valueChanges();
  }

  //gets reservations for a particular user
  getUserReservations(uid){
  	return this.db.list('reservations', ref => ref.orderByChild('user').equalTo(uid))
  		.snapshotChanges();
  }


  //gets reservations for a particular venue
  getVenueReservations(id): any{
  	return this.db.list('reservations', ref => ref.orderByChild('venue').equalTo(id))
  		.snapshotChanges();
  }

  //gets reservations for a venue using valueChanges()
  getVenueReservationsValues(id): any{
  	return this.db.list('reservations', ref => ref.orderByChild('venue').equalTo(id))
  		.valueChanges();
  }

  //get minimum order value specified by venue
  getMinSpend(key){
    return this.db.object('Venues/' + key + '/minimumSpendPerOrder').valueChanges();
  }


  //get number of tables available for booking per night on our app
  getVenueReservationLimit(venueId):any{
    console.log("Getting # of tables for venue with id: ", venueId);

    return this.db.object('Venues/' + venueId + '/tablesPerEvent').valueChanges();
  }

  confirmReservation(reservationKey){
    //confirms reservation belonging to venue
    var promise = this.db.object('reservations/' + reservationKey + '/status').set('confirmed');
    return promise;
  }

  rejectReservation(reservationKey){
    //rejects reservation belonging to venue
    var promise = this.db.object('reservations/' + reservationKey + '/status').set('rejected');
    return promise;
  }

  deleteReservation(reservationKey){
    //deletes reservation belonging to venue
    var promise = this.db.object('reservations/' + reservationKey).remove();
    return promise;
  }

  //haven't used this yet
  getVenueReservationsByDate(venueId, date){
    //queries the rsrvations in db for those belonging to this venue, on the specified day
    this.db.list('reservations', ref => ref.orderByChild('venue').equalTo(venueId))
  		.valueChanges()
      .subscribe(res => {
        //filter reservations for ones for this date
        var reservations = res.filter((rs:any) => rs.date === date);
        return reservations;
      });
  }

  //implementation of this was moved to component
  //get available booths left for a venue on a particular night
  getAvailableBooths(venueId, date){
    //console.log("Getting available booths for venue: " + venueId + " on date: " + date);
    //local variables for func
    var boothCount = 0;
    var reservationsMade = 0;

      //get number of booths per event for venue

      this.getVenueReservationLimit(venueId)
        .subscribe((res) => {
          boothCount = res;
          if(!res){
            // WHAT TO DO IF VENUE DOESNT SPECIFY THEIR TABLE LIMIT
            //set to 5 and let user carry on, because venue still has to confirm the reservation
            boothCount = 5;
          }

          console.log("Booth count is: ", boothCount);

          //get number of reservations made so far for venue on particular night
          this.db.list('reservations', ref => ref.orderByChild('venue').equalTo(venueId))
            .valueChanges()
            .subscribe((result) => {
              //console.log(result);

              //store all reservations made on particular night for venue in variable
              var allReservations = result.filter((rs:any) => rs.date === date);

              //console.log(allReservations);
              //calculate how many there are and store in variable
              reservationsMade = allReservations.length;
              console.log("Reservations made at venue on select date: ", reservationsMade);

              //compare to see if they have spots available still
              var difference = 0;
              if(reservationsMade < boothCount)
                difference = boothCount - reservationsMade;

              //return difference
              console.log("Booths available: ", difference);
              return difference;
            });
        });

/*
    forkJoin(
        this.getVenueReservationLimit(venueId),
        this.getVenueReservations(venueId)
    )
    .subscribe(([booths, resList]) => {
      console.log("booths: ", booths);
      console.log("resList: ", resList);
      //variable assignment
      boothCount = booths;
      //set this to 0 in case list is undefined...
      reservationsMade = 0;
      if(resList.length)
        reservationsMade = resList.length; //...otherwise assign to res here

      console.log("Booth count is: ", boothCount);
      console.log("Reservation count is: ", reservationsMade);

      //compare
      var difference = 0;
      if(reservationsMade < boothCount)
        difference = boothCount - reservationsMade;

      //return difference
      console.log("Booths available: ", difference);
      return difference;
    });
*/

  }
}
