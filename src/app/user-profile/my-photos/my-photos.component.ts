import { Component, OnInit } from '@angular/core';
import { AuthService }from '../../services/auth.service';
import { UserMediaService } from '../../services/user-media.service';

@Component({
  selector: 'app-my-photos',
  templateUrl: './my-photos.component.html',
  styleUrls: ['./my-photos.component.css']
})
export class MyPhotosComponent implements OnInit {

  myMedia: any;
  myUid: any;

  constructor(
  	private authSvc: AuthService,
  	private userMediaSvc: UserMediaService) { 
  		this.myUid = authSvc.getCurrentUser().uid;
  		this.myMedia = userMediaSvc.getUserPhotos(this.myUid);
  }

  ngOnInit() {
  }

}
