import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../services/auth.service';
import { UserMediaService } from '../services/user-media.service';
import { BuddiesService } from '../services/buddies.service';
import { MatSnackBar } from '@angular/material';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewFriendsComponent } from './view-friends/view-friends.component';

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
    public buddiesSvc: BuddiesService,
    public snackBar: MatSnackBar,
    private modalSvc: NgbModal) { 
      this.currentUser = authSvc.getCurrentUser();

      //check if user is signed in 
      if(!this.currentUser){
        console.log("User not signed in, redirecting...");
        snackBar.open('You are not signed in, redirecting...', '', {duration: 3000});
        router.navigate(['authenticate']);
      }

      else if(this.currentUser){  
        console.log("User is logged in!");
        //if user is signed in execute this portion of code
        userMedSvc.getUserPhotos(this.currentUser.uid)
          .subscribe(res => {
            res.forEach(_=> this.postsCount++);
          });

        buddiesSvc.getUserBuddies(this.currentUser.uid)
          .subscribe(res => {
            res.forEach(_=> this.friendCount++);
          });
      }
  }

  ngOnInit() {
  }

  logOut() {
    this.afAuth.auth.signOut();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserUID');
    this.router.navigate(['authenticate']);
  }

  viewFriends(){
    const modalRef = this.modalSvc.open(ViewFriendsComponent);
  }

}
