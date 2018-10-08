import { Component, OnInit } from '@angular/core';
import { CheckInService } from '../services/check-in.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-check-in-scanner',
  templateUrl: './check-in-scanner.component.html',
  styleUrls: ['./check-in-scanner.component.css']
})
export class CheckInScannerComponent implements OnInit {

  cameraEnabled: boolean = false; //for accessing a users camera and subsequently starting scanner
  scanIsComplete: boolean = false;
  selectedDevice: any;
  reservationInfo: any;

  constructor(
    private checkInSvc: CheckInService,
    private location: Location) { }

  ngOnInit() {
  }

  goBack(){
    this.location.back();
  }

  scanComplete(res){
    //console.log(res);

    this.reservationInfo = JSON.parse(res);
    console.log(this.reservationInfo);

    //stop scanner
    //this.cameraEnabled = false;
    //hide scanning view
    this.scanIsComplete = true;
    this.checkInUser();
  }

  enableCamera(event){
    //set camera to one of devices found
    if(event.length > 0){
      if(event.length > 1) 
        this.selectedDevice = event[1];
      else
        this.selectedDevice = event[0];

      this.cameraEnabled = true;
    }

    //console.log(event);
  }

  //check in user and restart scanning 
  checkInUser(){
    //check in user and propagate information across the rest of the app
    this.checkInSvc.checkIn(this.reservationInfo.user, this.reservationInfo.venue);
  }

}
