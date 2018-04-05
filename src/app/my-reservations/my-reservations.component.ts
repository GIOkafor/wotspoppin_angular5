import { Component, OnInit, ViewContainerRef, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ReservationService } from '../services/reservation.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ReservationDetailsComponent } from '../reservation-details/reservation-details.component';

@Component({
  selector: 'app-my-reservations',
  templateUrl: './my-reservations.component.html',
  styleUrls: ['./my-reservations.component.css']
})
export class MyReservationsComponent implements OnInit {

  userReservations: any;

  constructor(
  	private authSvc: AuthService,
    private rsrvSvc: ReservationService,
    private modalService: BsModalService) {
  		this.getReservations(); 
    }

  ngOnInit() {
  }

  getReservations(){
    this.rsrvSvc.getUserReservations(this.authSvc.getCurrentUser().uid)
      .subscribe(res => this.userReservations = res);
  }

  viewDetails(rsrv){
    const initialState = {
      reservation: rsrv
    };

    this.modalService.show(ReservationDetailsComponent, {initialState});
  }

}
