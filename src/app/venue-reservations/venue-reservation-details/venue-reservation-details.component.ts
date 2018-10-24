import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-venue-reservation-details',
  templateUrl: './venue-reservation-details.component.html',
  styleUrls: ['./venue-reservation-details.component.css']
})
export class VenueReservationDetailsComponent implements OnInit {

  reservation: any;

  constructor(
    public dialogRef: MatDialogRef<VenueReservationDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.reservation = data.reservation;
  }

  ngOnInit() {
  }

  acceptClose(){
    //accept reservation and close
    //console.log("accept reservation and close");
    var response = {key: this.reservation.key, message: 'accept'}
    this.dialogRef.close(response);
  }

  rejectClose(){
    //reject reservation and close
    //console.log("reject reservation and close");
    var response = {key: this.reservation.key, message: 'reject'}
    this.dialogRef.close(response);
  }

  deleteReservation(){
    var response = {key: this.reservation.key, message: 'delete'}
    this.dialogRef.close(response);
  }
}
