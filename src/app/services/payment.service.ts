import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class PaymentService {
  
  currentUser: any;
  chargeUrl = 'https://us-central1-noteapp-436f9.cloudfunctions.net/chargeCustomer';
  //curl -X POST -H "Content-Type:application/json" 'https://us-central1-noteapp-436f9.cloudfunctions.net/chargeCustomer' -d '{"uid":"1egj3boNuwTYg2ynaf4mrL0i3Bs2", "cost": 20000}'

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(
  	private db: AngularFireDatabase,
  	private authSvc: AuthService,
    private http: HttpClient) { 
  		this.currentUser = this.authSvc.getCurrentUser();
  }


  //stores token generated from user card for later charges
  storeTkn(tkn){
  	this.db.object('Users/' + this.currentUser.uid + '/paymentInfo/token')
  		.set(tkn);
  }

  //CHARGE USER Account based on pregenerated, stored token
  chargeUser(uid, cost){
    console.log("Charging user: " + uid + " " + cost);
    let data = {"uid": uid, "cost": cost};

    
      console.log("Regular data: ", data);
      /*console.log(data.toString());*/
      console.log(JSON.stringify(data));
    
    return this.http.post(this.chargeUrl, JSON.stringify(data))
      .map((res) => res);
  }

  //CHECK IF USER HAS PAYMENT INFO on file
  async checkPayment():Promise<boolean>{
  	let payInfo;
  	await this.db.object('Users/' + this.currentUser.uid + '/paymentInfo/token').valueChanges()
  		.subscribe(res => {
  			payInfo = res;
  			console.log(payInfo);

  			if(payInfo){
		  		console.log("user has payment info on file");
          return true;
        }
		  	else{
		  		console.log("user does not have payment info on file");//show payment info component as dialog/popup
		  		return false;
		  	}
  		})
  	
    return false;
  }

  getPaymentInfo(){
    return this.db.object('Users/' + this.currentUser.uid + '/paymentInfo/token').valueChanges();
  }

}
