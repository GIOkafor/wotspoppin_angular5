import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database'; 
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  venues: Observable<any[]>;
  view: any;

  constructor(
  	private db: AngularFireDatabase,
  	private router: Router) { }

  ngOnInit() {
  	this.venues = this.getVenues();
  	this.view = 'list';
  }

  getVenues(){
  	return this.db.list('/Venues').valueChanges();
  }

  getVenue(venue){
  	//console.log("Getting venue: ", venue);

  	//id here is the venue key property saved upon creation via cloud function
  	this.router.navigate(['venue', venue.id]);
  }

  changeView(format){
  	this.view = format;
  }

}
