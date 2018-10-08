import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'basic-top-nav',
  templateUrl: './basic-top-nav.component.html',
  styleUrls: ['./basic-top-nav.component.css']
})
export class BasicTopNavComponent implements OnInit {

  constructor(
  	private location: Location) { }

  ngOnInit() {
  }

  goBack(){
  	this.location.back();
  }

}
