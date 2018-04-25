import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth-component.component.html',
  styleUrls: ['./auth-component.component.css']
})
export class AuthComponentComponent implements OnInit {

  newUser: boolean = false;
  userSignUp: boolean = false;
  venueSignIn: boolean = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;

  constructor(
  	public afAuth: AngularFireAuth,
  	public db: AngularFireDatabase,
    public router: Router,
    private authSvc: AuthService,
    private fBuilder: FormBuilder) { }

  ngOnInit() {
  	firebase.auth().onAuthStateChanged(user => {
  		console.log("Auth state has changed, user: ", user);

  		if(user){
	  		//build user object
				var currentUser = {
					'uid': user.uid,
					'email': user.email,
          'displayName': user.displayName
				}

        console.log("User object created is: ", currentUser);
        this.authSvc.updateLocStor(currentUser);
  			//localStorage.setItem('currentUser', JSON.stringify(currentUser));

        //bind database reference to variable for easy access and manipulation
        const userRef = this.db.object('Users/' + user.uid + '/userInfo');
        
        //get contents of user in database
        userRef.snapshotChanges().subscribe(res => {

          //if this is a brand new user, or user without profile information, code below gets triggered
          if(res.payload.val() == null){

            //this gets triggered when venues try signing in because their account info is in a seperate section
            //'/Users' vs 'venue-users'

            //console.log("Checking for user: ", user.uid);

            //check if user has created a venue in the past
            this.db.list('Venues/', ref => ref.orderByChild('createdBy').equalTo(user.uid))
            .snapshotChanges().subscribe(res => {
              //console.log(res);

              if(res.length == 0){
                console.log("this user currently has no venues created");
                //do nothing but show next page in sequence
              }else{
                //user exists already, therefore show them their venue page
                //console.log("Navigating to venue with key: ", res);
                this.router.navigate(['venues']);
              }
            })
            
            
            //below is no longer necessary because users fill in all their info before creating account
            //venues create their account, then venue and optionally fill out their info themselves
            /*
              //set userInfo in db to current user before navigating, set email as well
              const promise = userRef.update({ displayName: user.displayName, imageUrl: user.photoURL, email: user.email });

              //navigate user to profile view so they can fill out their key information
              promise.then(_=> this.router.navigate(['edit-profile', user.uid]));
            */

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

      //if new user auth'ing
      this.firstFormGroup = this.fBuilder.group({
      email: ['', Validators.required]
      });
      this.secondFormGroup = this.fBuilder.group({
        displayName: ['', Validators.required]
      });
      this.thirdFormGroup = this.fBuilder.group({
        password: ['', Validators.required]
      });
      this.fourthFormGroup = this.fBuilder.group({
        birthday: ['', Validators.required]
      });
      this.fifthFormGroup = this.fBuilder.group({
        sex: ['', Validators.required]
      });
      this.sixthFormGroup = this.fBuilder.group({
        card: ['', Validators.required]
      });
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

  showUserSignUp(){
    //console.log("Showing user signup");
    this.userSignUp = true;
  }

  emailLogin(val){
    console.log(val);

    //specify how login happens ie emailSignIn or userEmailSignIn

    this.authSvc.emailSignIn(val.email, val.password);
  }

  emailSignup(){
    let val = this.firstFormGroup;//email, displayName, password, birthday, sex, credit card info

    //create user sign up object
    let user = {
      email: this.firstFormGroup.value.email,
      displayName: this.secondFormGroup.value.displayName,
      password: this.thirdFormGroup.value.password,
      birthday: this.fourthFormGroup.value.birthday,
      sex: this.fifthFormGroup.value.sex
    }

    console.log(user);
    this.authSvc.userEmailSignUp(user);
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
