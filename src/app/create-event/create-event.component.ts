import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import { MatSnackBar } from '@angular/material';
import { UploadService } from '../services/upload.service';
import { Upload } from '../classes/upload';

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
  imageSource: any; //for toggling venue image source
  //file upload vars
  currentUpload: Upload;
  selectedFiles: FileList;

  constructor(
  	private router: Router,
    private fb: FormBuilder,
    private db: AngularFireDatabase,
    private authSvc: AuthService,
    private snackBar: MatSnackBar,
    private location: Location,
    private upSvc: UploadService) { 

	  //check if user is authenticated first
    this.user = authSvc.getCurrentUser();

    if(!this.user){
      snackBar.open('You need to be signed in to create an event', '', {duration: 5000});
      router.navigate(['authenticate']);
    }

  //form initialization
  	this.eventForm = fb.group({
  		'name': ['', Validators.required],
  		'date': ['', Validators.required],
  		'description': ['', Validators.required],
      'promoImage': ['', Validators.required],
      'eventType': ['', Validators.required],
  		'address': ['', Validators.required],
      'eventVisibility': ['', Validators.required],
      'ticketPrice': ['', Validators.required],
      'availableTickets': 20
  	});
  }

  ngOnInit() {
  }

  onSubmit(event){
    console.log("Creating event");
  }

  newEvent(event){
    //get creator uid
    event.createdBy = this.authSvc.getCurrentUser().uid;
    //convert date to EPOCH time
    event.date = new Date(event.date).getTime();

    console.log("Creating event: ", event);

    const promise = this.db.list('Events/').push(event);

    promise.then(res =>{
      this.eventForm.reset();

      let snackBarRef = this.snackBar.open("Event created successfully", '', {duration: 3000});
      //console.log(res.key);
      
      snackBarRef.afterDismissed().subscribe(() => {
        //navigate to event view
        this.router.navigate(['/event-details', res.key]);
      });
      
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
        
        this.upSvc.eventUpload(this.currentUpload, (res)=>{
          console.log("Setting value to: ", res);
          this.eventForm.controls['promoImage'].setValue(res);
        });
      }else{
        console.log("No file chosen");
      }
    }
  }

}
