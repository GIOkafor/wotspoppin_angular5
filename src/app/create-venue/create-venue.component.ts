import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadService } from '../services/upload.service';
import { Upload } from '../classes/upload';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-create-venue',
  templateUrl: './create-venue.component.html',
  styleUrls: ['./create-venue.component.css']
})
export class CreateVenueComponent implements OnInit {

  venuesList: any;//venue list will be referenced here
  formData:any; //use this to prepare object to be pushed to db
  currentUser: any;
  venueForm: FormGroup;
  imageSource: any; //for toggling venue image source
  //file upload vars
  currentUpload: Upload;
  selectedFiles: FileList;

  //UNSTABLE
  //google maps variable declaration
  defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-33.8902, 151.1759),
    new google.maps.LatLng(-33.8474, 151.2631));

  options = {
    bounds: this.defaultBounds,
    types: ['geocode']
  };

  @ViewChild('addressTest') addressTest: ElementRef;
  @ViewChild('address') address: ElementRef;

  autocomplete:any;

  constructor(
    private authSvc: AuthService,
    private db: AngularFireDatabase,
    private http: HttpClient,
    private router: Router,
    private location: Location,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private upSvc: UploadService) { 
      this.currentUser = authSvc.getCurrentUser();
      this.venuesList = db.list('Venues');

      if(!this.currentUser){
        snackBar.open('You need to be signed in to create an event', '', {duration: 5000});
        router.navigate(['authenticate']);
      }

      //initialize form
      this.venueForm = fb.group({
        'name': ['', Validators.required],
        'address': ['', Validators.required],
        'hours': ['', Validators.required],
        'imageUrl': [''],
        'createdBy': [ authSvc.getCurrentUser().uid ],
        'position': ['']
      });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log(this.address.nativeElement);
    this.autocomplete  = new google.maps.places.Autocomplete(this.address.nativeElement, this.options);
    var self = this;
    
    this.autocomplete.addListener('place_changed', function() {
      var address = this.getPlace();
      //console.log(address);
      
      //update address value
      self.updateFormAddress(address.formatted_address);
    });
  }

  updateFormAddress(val){
    console.log("Updating to: ", val);
    this.venueForm.controls['address'].setValue(val);
  }

  subTest(val){
    //console.log("Received value: ", val);

    //this.venueForm.controls['position'].setValue({lat: '2', lng: '9'});

    //console.log("Formatted val: ", this.venueForm.value)

    //this figures out the users location thanks to google maps geolocation
    this.http.get<LocationResponse>('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.venueForm.value.address + '&key=AIzaSyAxItQwMaVAujemX60JzQFIlsTKKrRiQDo')
      .subscribe(res => {
        //console.log(res);

        this.venueForm.controls['position'].setValue(res.results[0].geometry.location);
        //console.log(this.formData.position);

        //add form data to list of venues 
        this.venuesList.push(this.venueForm.value)
          .then(res => {
            console.log("Venue added successfuly");
            let snackBarRef = this.snackBar.open("Venue successfully created", '', {duration: 3000});
            
            snackBarRef.afterDismissed()
              .subscribe(_=> this.router.navigate(['venue', res.key]));
          })

          //error handling
          .catch(err => this.snackBar.open('ERROR! You do not have access.', '', {duration: 3000}));
      });
  }

  onSubmit(form: any){
  	//debuging code
  	console.log('Form submitted with value: '+form.name);
  	console.log('Form submitted with value: '+form.address);
  	console.log('Form submitted with value: '+form.hours);
  	console.log('Form submitted with value: '+form.imageUrl);

	//actual code
	//prepare form object
  	this.formData = form;

  	this.formData.createdBy = this.currentUser.uid;

    //this figures out the users location thanks to google maps geolocation
    this.http.get<LocationResponse>('https://maps.googleapis.com/maps/api/geocode/json?address=' + this.formData.address + '&key=AIzaSyAxItQwMaVAujemX60JzQFIlsTKKrRiQDo')
      .subscribe(res => {
        console.log(res);

        this.formData.position = res.results[0].geometry.location;
        console.log(this.formData.position);

        //add form data to list of venues 
        this.venuesList.push(this.formData)
          .then(res => {
            console.log("Venue added successfuly");
            let snackBarRef = this.snackBar.open("Venue successfully created", '', {duration: 3000});
            
            snackBarRef.afterDismissed()
              .subscribe(_=> this.router.navigate(['venue', res.key]));
          })

          //error handling
          .catch(err => this.snackBar.open('ERROR! You do not have access.', '', {duration: 3000}));
      });

  }

  goBack(){
    this.location.back();
  }

  //for toggling image src input
  imageSrc(val){
    //console.log(val);
    this.imageSource = val;
  }

  //
  //for detecting when user selects image from their device then calls photo upload function
  detectFiles(event) {
    this.selectedFiles = event.target.files;

    //call upload single after file is selected
    this.uploadSingle();
  }

  uploadSingle() {
    //doesn't let user upload photo unless they have an account
    if(this.authSvc.checkUserAuth()){
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
  }

  //for address select list
  suggest(val){
    console.log(val);
  }

}

interface LocationResponse{
  results: any[];
}
