import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css']
})
export class CreateEventComponent implements OnInit {

  eventForm: FormGroup;
  //TODO: get venue's existing events
  //for now it's just going to reference all events 'Venues/events'
  events: any;//FirebaseListObservable<any>;
  user: any;//firebase.User;//reference to current user

  constructor(
  	private router: Router,
    private fb: FormBuilder) { 

	//form initialization
  	this.eventForm = fb.group({
  		'name': ['Event Name', Validators.required],
  		'date': ['', Validators.required],
  		'description': ['Event description', Validators.required],
  		'promoImage': ['', Validators.required]
  	});
  }

  ngOnInit() {
  }

  onSubmit(event){
    console.log("Creating event");
  }

}
