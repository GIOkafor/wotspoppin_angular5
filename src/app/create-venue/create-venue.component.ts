import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-venue',
  templateUrl: './create-venue.component.html',
  styleUrls: ['./create-venue.component.css']
})
export class CreateVenueComponent implements OnInit {

  venuesList: any;//venue list will be referenced here
  formData: any; //user this to prepare object to be pushed to db
  currentUser: any;

  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase,
    private http: HttpClient) { 
      this.currentUser = authSvc.getCurrentUser();
      this.venuesList = db.list('Venues');
  }

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

  	this.formData.createdBy = this.currentUser.uid;

    this.http.get<LocationResponse>('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.formData.address + '&key=AIzaSyAxItQwMaVAujemX60JzQFIlsTKKrRiQDo')
      .subscribe(res => {
        console.log(res);

        this.formData.position = res.results[0].geometry.location;
        console.log(this.formData.position);

        //add form data to list of venues 
        this.venuesList.push(this.formData)
          .then(console.log("Venue added"));
      });

    /*
  		.then(_=> this.snackBar.open('Venue added successfully', '', {duration: 3000}))
  		.catch(err => this.snackBar.open('ERROR! You do not have access.', '', {duration: 3000}));
    */

  }

}

interface LocationResponse{
  results: any[];
}
