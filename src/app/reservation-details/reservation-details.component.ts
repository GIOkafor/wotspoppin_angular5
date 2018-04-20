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
  	//CONSIDER CHANGIN VALUE TO BE ENTIRE RESERVATION INFORMATION IN QRCODE FORMAT
    //this.value = this.reservation.key;

    let obj = {};

    //if type is bottle service do this
    if(this.reservation.payload.val().type === 'Bottle Service'){
      obj = {
        user: this.reservation.payload.val().user,
        type: this.reservation.payload.val().type,
        venue: this.reservation.payload.val().venue,
        order: this.reservation.payload.val().order.totalValue,
        date: this.reservation.payload.val().date
      }
    }else{
      obj = {
        user: this.reservation.payload.val().user,
        venue: this.reservation.payload.val().venue,
        price: this.reservation.payload.val().price,
        datePurchased: this.reservation.payload.val().datePurchased
      };
    }

    //convert object into string to pass into qrcode
    this.value = JSON.stringify(obj);
  }

}
