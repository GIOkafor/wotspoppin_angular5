import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-venues',
  templateUrl: './my-venues.component.html',
  styleUrls: ['./my-venues.component.css']
})
export class MyVenuesComponent implements OnInit {

  //user: firebase.User;
  myVenues: any;//firebase list of my venues

  constructor() { 
  	/*
  	this.user = firebase.auth().currentUser;

  	//get my venues based on my uid in createdBy field
  	this.myVenues = db.list('/Venues', {
  		query: {
  			orderByChild: 'createdBy',
  			equalTo: this.user.uid
  		}
  	})
  	*/
  }

  ngOnInit() {
  }

}
