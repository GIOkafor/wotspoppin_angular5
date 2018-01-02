import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class AuthService {

  constructor(
  	private snackBar: MatSnackBar,
  	private router: Router) { }

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

}
