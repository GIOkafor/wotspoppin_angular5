import { Component, OnInit } from '@angular/core';
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

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
  	this.venues = this.getVenues();
  	this.view = 'list';
  }

  getVenues(){
  	return this.db.list('/Venues').valueChanges();
  }

  getVenueImage(image){
  	console.log(image);
  	return image.toString();
  }

  changeView(format){
  	this.view = format;
  }

}
