import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class PaymentService {
  
  currentUser: any;

  constructor(
  	private db: AngularFireDatabase,
  	private authSvc: AuthService) { 
  		this.currentUser = this.authSvc.getCurrentUser();
  }


  //stores token generated from user card for later charges
  storeTkn(tkn){
  	this.db.object('Users/' + this.currentUser.uid + '/paymentInfo/token')
  		.set(tkn);
  }

  //CHARGE USER Account based on pregenerated, stored token
  chargeUser(uid){
  	//do smth
  }

  //CHECK IF USER HAS PAYMENT INFO on file
  checkPayment(): boolean{
  	let payInfo;
  	this.db.object('Users/' + this.currentUser.uid + '/paymentInfo/token').valueChanges()
  		.subscribe(res => {
  			payInfo = res;
  			console.log(payInfo);

  			if(payInfo)
		  		return true;
		  	else{
		  		console.log("user does not have payment info on file");//show payment info component as dialog/popup
		  		return false;
		  	}
  		})
  	
    return false;
  }

}
