import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-reservation-details',
  templateUrl: './reservation-details.component.html',
  styleUrls: ['./reservation-details.component.css']
})
export class ReservationDetailsComponent implements OnInit {

  reservation: any;
  value: any = '';

  constructor(
  	private route: ActivatedRoute,
  	private db: AngularFireDatabase) { }

  ngOnInit() {
  	this.route.paramMap
  		.switchMap((params: ParamMap) => this.db.object('reservations/'+params.get('id')).snapshotChanges())
  			.subscribe((res) => {
  				this.reservation = res;
  				this.value = this.reservation.key;
  			});
  }

}
