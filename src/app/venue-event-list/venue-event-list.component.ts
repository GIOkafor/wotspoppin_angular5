import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venue-event-list',
  templateUrl: './venue-event-list.component.html',
  styleUrls: ['./venue-event-list.component.css']
})
export class VenueEventListComponent implements OnInit {

  @Input()events: any;

  constructor(
  	private router: Router) { }

  ngOnInit() {
  }

  getEventDetails(event: any){
    this.router.navigate(['event-details', event.key]);
  }

}
