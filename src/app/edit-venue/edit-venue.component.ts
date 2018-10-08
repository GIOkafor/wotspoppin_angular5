import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { UploadService } from '../services/upload.service';
import { Upload } from '../classes/upload';

@Component({
  selector: 'app-edit-venue',
  templateUrl: './edit-venue.component.html',
  styleUrls: ['./edit-venue.component.css']
})
export class EditVenueComponent implements OnInit {
  venueId: any;
  venue: any;
  venueForm: FormGroup;
  hoursWorked: any = []; //object for keeping track of array of hours where establishment is open
  newHours: any = {day: '', startTime: '', endTime: ''};//for keeping track of new user entries
  //file upload stuff
  selectedFiles: FileList;
  currentUpload: Upload;
  
 //google maps variable declaration start
  defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-33.8902, 151.1759),
    new google.maps.LatLng(-33.8474, 151.2631));

  options = {
    bounds: this.defaultBounds,
    types: ['geocode']
  };

  @ViewChild('address') addressTest: ElementRef;

  autocomplete: any;
  //google maps variable declaration end

  //DEBUG CODE
  testHOURS = [
				{day: 'Monday', startTime: '10:00', endTime: '02:00'},
				{day: 'Tuesday', startTime: '10:00', endTime: '02:00'},
				{day: 'Wednesday', startTime: '10:00', endTime: '02:00'},
				{day: 'Thursday', startTime: '10:00', endTime: '02:00'}
			];

  constructor(
  	private route: ActivatedRoute,
  	private db: AngularFireDatabase,
  	private fb: FormBuilder,
  	private http: HttpClient,
  	private snackBar: MatSnackBar,
  	private upSvc: UploadService) { 
  		this.venueId = this.route.snapshot.paramMap.get('id');
	  	//console.log(this.venueId);

	  	this.getVenue(this.venueId)
	  	.subscribe(res => { 
	  		//console.log(res); 
	  		this.venue = res;
	  		let description;

	  		//check if description field exists on object, 
	  		//for catching venues that were created without description
	  		if(this.venue.description)
	  			description = this.venue.description;
	  		else
	  			description = '';

	  		//initialize form
			this.venueForm = this.fb.group({
				'name': [this.venue.name, Validators.required],
				'address': [this.venue.address, Validators.required],
				'hours': [''],
				'createdBy': [this.venue.createdBy],
				'imageUrl': [this.venue.imageUrl],
				'position': [''],
				'venueType': [this.venue.venueType, Validators.required],
				'baseCover': [this.venue.baseCover],
				'description': [description]
			});

			this.hoursWorked = this.venue.hours;
	  	});
  }

  ngOnInit() {}

  ngAfterViewInit() {
    /* Location autoupdate code is wonky as hell
	    console.log(this.addressTest.nativeElement);
	    this.autocomplete  = new google.maps.places.Autocomplete(this.addressTest.nativeElement, this.options);
	    var self = this;
	    
	    this.autocomplete.addListener('place_changed', function() {
	      var address = this.getPlace();
	      //console.log(address);
	      
	      //update address value
	      self.updateFormAddress(address.formatted_address);
	    });
    */
  }

  //for updating venueForm address when ther are changes made to adress input
  updateFormAddress(val){
    console.log("Updating to: ", val);
    this.venueForm.controls['address'].setValue(val);
  }

  getVenue(id){
  	return this.db.object('/Venues/' + id).valueChanges();
  }

  updateVenue(venueForm){
  	console.log("Updating venue: ", venueForm);

  	
  	//this figures out the users location thanks to google maps geolocation
    this.http.get<LocationResponse>('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.venueForm.value.address + '&key=AIzaSyAxItQwMaVAujemX60JzQFIlsTKKrRiQDo')
      .subscribe(res => {
        //console.log(res);

        this.venueForm.controls['position'].setValue(res.results[0].geometry.location);
        //console.log(this.formData.position);

		//set hours worked based on data from db and user updates
        this.venueForm.controls['hours'].setValue(this.hoursWorked);

        console.log("New venue info is: ", this.venueForm.value);
		
        //add form data to list of venues 
        this.db.object('/Venues/' + this.venueId).set(this.venueForm.value)
          .then(res => {
            console.log("Venue added successfuly");
            let snackBarRef = this.snackBar.open("Venue successfully updated", '', {duration: 3000});
            
            /*
	            snackBarRef.afterDismissed()
	              .subscribe(_=> this.router.navigate(['venue', res.key]));
            */
          })

          //error handling
          .catch(err => this.snackBar.open('ERROR! You do not have access.', '', {duration: 3000}));
      
      });
    
  }

  //for removing day from hours of operation
  remove(day){
  	this.hoursWorked.splice(day, 1);
  }

  //for adding new hours to list of working times
  addHours(newHours, startTime, endTime){

  	let newDay = { 
  		day: newHours, 
  		startTime: startTime, 
  		endTime: endTime 
  	};

  	this.hoursWorked.push(newDay);
  }

  detectFiles(event) {
    this.selectedFiles = event.target.files;

    //call upload single after file is selected
    this.uploadSingle();
  }

  uploadSingle() {
	let file = this.selectedFiles.item(0)

	if(file){
		this.currentUpload = new Upload(file);

		this.upSvc.profileUpload(this.currentUpload, (res)=>{
		  //console.log("Setting value to: ", res);
		  this.venueForm.controls['imageUrl'].setValue(res);
		});
	}else{
		console.log("No file chosen");
	}
  }

  setVenueType(type){
  	this.venueForm.controls['venueType'].setValue(type);
  }

  formatLabel(value: number | null){
  	if(!value)
  		return 0;

  	return '$' + value;
  }
}

interface LocationResponse{
  results: any[];
}
