import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../services/auth.service';
import { UserMediaService } from '../services/user-media.service';
import { BuddiesService } from '../services/buddies.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  //vars
  currentUser: any;
  postsCount: number = 0;
  friendCount: number = 0;

  constructor(
  	public afAuth: AngularFireAuth,
  	public router: Router,
    public authSvc: AuthService,
    public userMedSvc: UserMediaService,
    public buddiesSvc: BuddiesService) { 
      this.currentUser = authSvc.getCurrentUser();
      userMedSvc.getUserPhotos(this.currentUser.uid)
        .subscribe(res => {
          res.forEach(_=> this.postsCount++);
        });

      buddiesSvc.getUserBuddies(this.currentUser.uid)
        .subscribe(res => {
          res.forEach(_=> this.friendCount++);
        });
  }

  ngOnInit() {
  }

  logOut() {
    this.afAuth.auth.signOut();
    localStorage.removeItem('currentUser');
    this.router.navigate(['authenticate']);
  }

}
