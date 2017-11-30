import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-venue',
  templateUrl: './create-venue.component.html',
  styleUrls: ['./create-venue.component.css']
})
export class CreateVenueComponent implements OnInit {

  venuesList: any;//venue list will be referenced here
  formData: any; //user this to prepare object to be pushed to db

  constructor() { }

  ngOnInit() {
  }

  onSubmit(form: any){
  	//debuging code
  	console.log('Form submitted with value: '+form.name);
  	console.log('Form submitted with value: '+form.address);
  	console.log('Form submitted with value: '+form.hours);
  	console.log('Form submitted with value: '+form.imageURL);

	//actual code
	//prepare form object
  	this.formData = form;

  	/*
  	this.formData.createdBy = this.user.uid;
  	
  	//add form data to list of venues 
  	this.venuesList.push(this.formData)
  		.then(_=> this.snackBar.open('Venue added successfully', '', {duration: 3000}))
  		.catch(err => this.snackBar.open('ERROR! You do not have access.', '', {duration: 3000}));

  	*/
  }

}
