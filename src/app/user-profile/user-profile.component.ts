import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
  	public afAuth: AngularFireAuth,
  	public router: Router) { }

  ngOnInit() {
  }

  logOut() {
    this.afAuth.auth.signOut();
    localStorage.removeItem('currentUser');
    this.router.navigate(['authenticate']);
  }

}
