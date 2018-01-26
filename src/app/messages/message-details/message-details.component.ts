import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-message-details',
  templateUrl: './message-details.component.html',
  styleUrls: ['./message-details.component.css']
})
export class MessageDetailsComponent implements OnInit {

  constructor(
  	private location: Location) { }

  ngOnInit() {
  }

  goBack(){
  	this.location.back();
  }

}
