import { Component, OnInit } from '@angular/core';
import { AuthService }from '../../services/auth.service';
import { UserMediaService } from '../../services/user-media.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-my-photos',
  templateUrl: './my-photos.component.html',
  styleUrls: ['./my-photos.component.css']
})
export class MyPhotosComponent implements OnInit {

  myMedia: any;
  myUid: any;
  menu = false;//for showing trash icon

  constructor(
  	private authSvc: AuthService,
  	private userMediaSvc: UserMediaService,
  	private uploadSvc: UploadService) { 
  		this.myUid = authSvc.getCurrentUser().uid;
  		this.myMedia = userMediaSvc.getUserPhotos(this.myUid);
  }

  ngOnInit() {
  }

  toggleMenu(){
  	//console.log("Toggling menu");
  	this.menu = !this.menu;
  	//console.log("Menu is now: ", this.menu);
  }

  deleteMedia(media){
  	//console.log("Deleting media: ", media);
  	this.uploadSvc.deleteUpload(media);
  }
}
