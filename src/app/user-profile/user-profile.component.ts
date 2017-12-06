import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../services/auth.service';
import { UserMediaService } from '../services/user-media.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  //vars
  currentUser: any;
  postsCount: number = 0;
  friendCount: number;

  constructor(
  	public afAuth: AngularFireAuth,
  	public router: Router,
    public authSvc: AuthService,
    public userMedSvc: UserMediaService) { 
      this.currentUser = authSvc.getCurrentUser();
      userMedSvc.getUserPhotos(this.currentUser.uid)
        .subscribe(res => {
          res.forEach(_=> this.postsCount++);
        })
  }

  ngOnInit() {
  }

  logOut() {
    this.afAuth.auth.signOut();
    localStorage.removeItem('currentUser');
    this.router.navigate(['authenticate']);
  }

}
