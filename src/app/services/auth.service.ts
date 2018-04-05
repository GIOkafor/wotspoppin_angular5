import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { ErrorComponent } from '../error/error.component';

@Injectable()
export class AuthService {

  constructor(
  	private snackBar: MatSnackBar,
  	private router: Router,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private db: AngularFireDatabase) { }

  getCurrentUser(){
  	var currentUser = localStorage.getItem('currentUser');

  	return JSON.parse(currentUser);
  }

  //not used in all instances, due to inability to stop rest of function skip
  checkUserAuth(): boolean{
  	if(this.getCurrentUser() == null){
  		this.snackBar.open('You are not signed in, redirecting you to authentication screen...', '', { duration: 3000 })
	        .afterDismissed().subscribe(() => {
	          this.router.navigate(['authenticate']);
	        });
  	}else{
  		return true;
  	}
  }

  //update local storage value
  updateLocStor(val){
    console.log('Raw value passed: ' + val);
    console.log(JSON.stringify(val));
    
    //remove old info
    localStorage.removeItem('currentUser');
    //add new
    localStorage.setItem('currentUser', JSON.stringify(val));
  }

  //create new account using email and password
  //specifically for venues
  emailSignUp(val){
    this.afAuth.auth.createUserWithEmailAndPassword(val.email, val.password)
      .then(_=> {
        //add user info to profile
        this.db.object('/venue-users/'+this.afAuth.auth.currentUser.uid + '/userInfo').set({email: val});

        this.sendEmailVerification();

        //save user uid for later use
        var currentUser = {
          uid : this.afAuth.auth.currentUser.uid
        } 

        this.updateLocStor(currentUser);

        //redirect to venue creation page
        this.router.navigate(['/create-venue']);
      })
      .catch(err => this.handleError(err.message));
  }

  //user creates new account using email and password
  //specifically for users
  userEmailSignUp(val){
    this.afAuth.auth.createUserWithEmailAndPassword(val.email, val.password)
      .then(_=> {
        //add user info to db
        this.db.object('Users/' + this.afAuth.auth.currentUser.uid + '/userInfo').set({email: val.email, displayName: val.displayName, sex: val.sex})
          .then(_=> {
            //send account verification email
            this.sendEmailVerification();

            //if user entered their credit card information in sign up form, update their payment info
            if(val.cardInfo)
              //update payment info

            //otherwise continue here
        /*
            //save user uid for later use
            var currentUser = {
              uid : this.afAuth.auth.currentUser.uid
            } 

            this.updateLocStor(currentUser);
*/
            //redirect to homepage
            this.router.navigate(['/venues']);
          });
      }).catch(err => this.handleError(err.message));
  }

  handleError(errMessage){
    this.dialog.open(ErrorComponent, {
      data: errMessage,
    });
  }

  sendEmailVerification(){
    //sending email verification
    this.afAuth.auth.currentUser.sendEmailVerification()
     .then(_=> {
       //console.log("Email sent successfully");
       this.snackBar.open("Account confirmation email sent successfully", "", {duration: 3000});
     }).catch(error => {
       //console.log(error + " happened");
       this.snackBar.open(error, "", {duration: 3000});
     });
  }

  //sign in via email for venues and users
  emailSignIn(email, password){
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(_=> {
        var uid = this.afAuth.auth.currentUser.uid;
        localStorage.setItem('currentUserUID', uid);

      /*
        //find venue created by this user
        this.db.list('Venues/', ref => ref.orderByChild('createdBy').equalTo(uid)).snapshotChanges()
          .subscribe((res:any) => {
            console.log(res[0].key);
            
            //navigate to venue page
            this.router.navigate(['/venue/', res[0].key]);
          })
      */  
      })
      .catch(err => this.handleError(err.message));
  }

}
