import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth-component.component.html',
  styleUrls: ['./auth-component.component.css']
})
export class AuthComponentComponent implements OnInit {

  newUser: boolean = false;

  constructor(
  	public afAuth: AngularFireAuth,
  	public db: AngularFireDatabase,
    public router: Router) { }

  ngOnInit() {
  	firebase.auth().onAuthStateChanged(user => {
  		//console.log("Auth state has changed, user: ", user);

  		if(user){
	  		//build user object
				var currentUser = {
					'uid': user.uid,
					'email': user.email,
          'displayName': user.displayName
				}

  			localStorage.setItem('currentUser', JSON.stringify(currentUser));

        //bind database reference to variable for easy access and manipulation
        const userRef = this.db.object('Users/' + user.uid + '/userInfo');
        
        //get contents of user in database
        userRef.snapshotChanges().subscribe(res => {

          //if this is a brand new user, or user without profile information, code below gets triggered
          if(res.payload.val() == null){

            //set userInfo in db to current user before navigating, set email as well
            const promise = userRef.update({ displayName: user.displayName, imageUrl: user.photoURL, email: user.email });

            //navigate user to profile view so they can fill out their key information
            promise.then(_=> this.router.navigate(['edit-profile', user.uid]));

          }else{
            //console.log("User data exists in db");

            //set local storage var to what's in db
            currentUser.displayName = res.payload.val().displayName;
            currentUser.email = res.payload.val().email;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            //navigate to venue
            this.router.navigate(['venues']);
          }

        });
  		}
  	})
  }

  showSignUp(){
  	this.newUser = true;
  }

  showLogin(){
  	this.newUser = false;
  }

  //facebook auth methods start
  fbSignUp(){
  	this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  }

  fbLogin(){
  	this.afAuth.auth.signInWithRedirect(new firebase.auth.FacebookAuthProvider());
  }
  //facebook auth methods end

  //google auth method starts
  googleSignUp(){
  	this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }

  googleLogin(){
  	this.afAuth.auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
  }
  //google auth method ends

  logout() {
    this.afAuth.auth.signOut();
    localStorage.removeItem('currentUser');
  }

  /*	
	  //check if user exists in db
	  checkIfUserExists(){
	  	var currentUser = JSON.parse(localStorage.getItem('currentUser'));
	  	console.log(currentUser.uid);

	  	return this.db.list('Users/' + currentUser.uid '/userInfo').valueChanges();
	  }
  */

}
