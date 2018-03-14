import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-venue-signup',
  templateUrl: './venue-signup.component.html',
  styleUrls: ['./venue-signup.component.css']
})
export class VenueSignupComponent implements OnInit {

  constructor(
  	private authSvc: AuthService) { }

  ngOnInit() {
  }

  createAccount(val){
  	//creates account then signs in and redirects user to venue creation page
  	//console.log("Creating user account, with value: ", val);

  	this.authSvc.emailSignUp(val);
  }
}
