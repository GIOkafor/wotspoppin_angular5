import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-attending-notification',
  templateUrl: './attending-notification.component.html',
  styleUrls: ['./attending-notification.component.css']
})
export class AttendingNotificationComponent implements OnInit {

  @Input()notification: any;

  constructor() { }

  ngOnInit() {
  }

}
