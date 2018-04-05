import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
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
  	private bsModalRef: BsModalRef) { }

  ngOnInit() {
  	this.value = this.reservation.key;
  }

}
