import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  
  venues: Observable<any[]>;
  view: any;
  mapOptions = {};

  constructor(
  	private db: AngularFireDatabase,
  	private router: Router,
    private http: HttpClient) { 
  }

  ngOnInit() {
  	this.venues = this.getVenues();
  	this.view = 'list';
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

}

