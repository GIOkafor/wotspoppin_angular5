import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ReservationService } from '../services/reservation.service';
import { VenueReservationDetailsComponent } from './venue-reservation-details/venue-reservation-details.component';

@Component({
  selector: 'app-venue-reservations',
  templateUrl: './venue-reservations.component.html',
  styleUrls: ['./venue-reservations.component.css']
})
export class VenueReservationsComponent implements OnInit {

  reservations: any;

  constructor(
    private activeRoute: ActivatedRoute,
    private reservationSvc: ReservationService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
      //this.reservationSvc.getVenueReservations
  }

  ngOnInit() {
    console.log('Venue key is: ', this.activeRoute.snapshot.params.id);

    this.reservationSvc.getVenueReservations(this.activeRoute.snapshot.params.id)
        .subscribe(res => this.reservations = res);
  }

  getAllReservations(venueId){
    //get all reservations that belong to a particular venue
    this.reservationSvc.getVenueReservations(this.activeRoute.snapshot.params.id)
        .subscribe(res => this.reservations = res);
  }

  getConfirmed(){
    //return all reservations with res.status === 'confirmed'
    //get all reservations again first to refresh filters
    this.reservationSvc.getVenueReservations(this.activeRoute.snapshot.params.id)
        .subscribe(res => {
          this.reservations = res;

          var confirmed = this.reservations.filter(res => {
            if(res.payload.val().status === 'confirmed')
              return true;
          });

          console.log(confirmed);
          this.reservations = confirmed;
        })

  }

  getPending(venueId){
    //return all reservations with res.status === 'pending'
    this.reservationSvc.getVenueReservations(this.activeRoute.snapshot.params.id)
        .subscribe(res => {
          this.reservations = res;

          var pending = this.reservations.filter(res => {
            if(res.payload.val().status === 'pending')
              return true;
          });

          console.log(pending);
          //assign var to reservations for display on client side
          this.reservations = pending;
        })
  }

  getRejected(venueId){
    //return all reservations with res.status === 'rejected'
    this.reservationSvc.getVenueReservations(this.activeRoute.snapshot.params.id)
        .subscribe(res => {
          this.reservations = res;

          var rejected = this.reservations.filter(res => {
            if(res.payload.val().status === 'rejected')
              return true;
          });

          console.log(rejected);
          //assign var to reservations for display on client side
          this.reservations = rejected;
        })
  }

  confirmReservation(key){
    //confirm reservation by setting status to 'confirmed'
    //console.log("Confirming reservation with key: ", key);

    this.reservationSvc.confirmReservation(key)
      .then(_=>{
        console.log("Confirmed successfully");
        this.snackBar.open("Reservation has been confirmed", '', {duration: 2000});
      })
      .catch(err => this.snackBar.open("An error occured", '', {duration: 2000}));
  }

  rejectReservation(key){
    //reject reservation by setting status to 'rejected'
    //console.log("Rejecting reservation with key: ", key);

    this.reservationSvc.rejectReservation(key)
      .then(_=> {
        console.log("Reservation has been rejected");
        this.snackBar.open("Reservation has been rejected", '', {duration: 2000})
      })
      .catch(err => this.snackBar.open("An error occured", '', {duration: 2000}));
  }

  deleteReservation(key){
    //reject reservation by setting status to 'rejected'
    //console.log("Deleting reservation with key: ", key);

    this.reservationSvc.deleteReservation(key)
      .then(_=>{
        console.log("Deleted successfully");
        this.snackBar.open("Reservation successfully deleted", '', {duration: 2000});
      })
      .catch(err => this.snackBar.open("An error occured"));
  }

  openDetailsDialog(val){
    console.log("Opening dialog with val: ", val);

    let dialogRef = this.dialog.open(VenueReservationDetailsComponent, {
      width: '300px',
      data: { reservation: val}
    });

    dialogRef.afterClosed().subscribe(res => {
      console.log("Dialog closed with result: ", res);
      //if res = 'accept' do something ;else if (res == 'reject') do something; else (user just closed dialog) do nothing;
      if(res !== undefined){
        if(res.message === 'accept')
          this.confirmReservation(res.key);
        else if(res.message === 'reject')
          this.rejectReservation(res.key);
        else if(res.message === 'delete')
          this.deleteReservation(res.key);
        }
    })
  }
}
