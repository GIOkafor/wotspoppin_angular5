import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AngularFireDatabase, AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import * as firebase from 'firebase';

@Component({
  selector: 'app-search-users',
  templateUrl: './search-users.component.html',
  styleUrls: ['./search-users.component.css']
})
export class SearchUsersComponent implements OnInit {

	results$:any;
  nameFilter: BehaviorSubject<string|null>;
  userFilter: any = { key: '', val: {displayName: '', email: '', imageUrl: ''} }; //for front end view filtering
	
  constructor(
  	private location: Location,
  	private db: AngularFireDatabase) { 
      
      this.nameFilter = new BehaviorSubject(null);

      this.results$ = Observable.combineLatest(
        this.nameFilter
        ).switchMap(([name]) => 
          db.list('Users', ref => {
            let query: firebase.database.Reference | firebase.database.Query = ref;
            if(name){ query = query.orderByChild('userInfo/displayName').equalTo(name) };
            return query;
            }).snapshotChanges().map(res => {
              return res.map(c => ({ key: c.payload.key, val: c.payload.val().userInfo }))
            })
        );
  }

  ngOnInit() {
  }

  goBack(){
  	this.location.back();
  }

  filterByName(name){
    console.log("Searching for user with name: ", name);
    this.nameFilter.next(name);
  }

  search(input){
  	let val = input.input;
  	console.log(val);

  	this.db.list('Users/', ref => ref.orderByChild('userInfo/displayName').equalTo(val))
  		.snapshotChanges()
  			.subscribe(res => {
  				console.log(res);
  				this.results$ = res;
  			});
  }

  //triggered by clicking on name in search suggestion list
  searchByClick(id){
    this.nameFilter.next(id);
    //this.search_complete = true;
  }
}
