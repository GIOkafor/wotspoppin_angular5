import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  
  venues: Observable<any[]>;
  view: any;
  mapOptions = {};
  events: any = []; //for getting and storing event info for display in map view
  marker = {
    display: true,
    lat: null,
    lng: null,
    address: null,
    name:null,
    description: null,
    date: null,
    key: null //for assigning event or venue key
  };
  hideMarker: any = null; //for hiding ans showing markers

  constructor(
  	private db: AngularFireDatabase,
  	private router: Router,
    private http: HttpClient) { 
  }

  ngOnInit() {
  	this.venues = this.getVenues();
  	this.view = 'list';
    this.events = this.getEvents();
  }

  getVenues(){
  	return this.db.list('/Venues').snapshotChanges();
  }

  getVenue(venue){
  	//console.log("Getting venue: ", venue);

  	//id here is the venue key property saved upon creation via cloud function
    //change to key
  	this.router.navigate(['venue', venue.key]);
  }

  changeView(format){
  	this.view = format;
  }

  getEvents(){
    return this.db.list('Events/').snapshotChanges();
  }

  clicked({target: marker}, targ) {
    console.log("Target is: ", targ);
    
    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();

    //assign values to elements to be shown in info box
    this.marker.address = targ.payload.val().address;
    this.marker.description = targ.payload.val().description;//probabl going to cry
    this.marker.name = targ.payload.val().name;

    //if target is an event, it will have date
    if(targ.payload.val().date)
      this.marker.date = targ.payload.val().date;
    else
      this.marker.date = null;
      
    this.marker.key = targ.key;

    marker.nguiMapComponent.openInfoWindow('iw', marker);
  }

  //doesnt reinstate removed element
  filterRes(val){
    console.log("Filtering results: ", val);

    if(val === 'clubs'){
      this.hideMarker = 'clubs'
    }
    else if(val === 'events'){
      this.hideMarker = 'events'
    }

  }

}

