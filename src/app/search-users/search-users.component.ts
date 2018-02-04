import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent implements OnInit {

	results: any;
	
  constructor(
  	private location: Location,
  	private db: AngularFireDatabase) { }

  ngOnInit() {
  }

  goBack(){
  	this.location.back();
  }

  search(input){
  	let val = input.input;
  	console.log(val);

  	this.db.list('Users/', ref => ref.orderByChild('userInfo/displayName').equalTo(val))
  		.snapshotChanges()
  			.subscribe(res => {
  				console.log(res);
  				this.results = res;
  			});
  }
}
