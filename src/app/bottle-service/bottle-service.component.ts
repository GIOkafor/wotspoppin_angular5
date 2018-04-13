import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { ReservationService } from '../services/reservation.service';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-bottle-service',
  templateUrl: './bottle-service.component.html',
  styleUrls: ['./bottle-service.component.css']
})
export class BottleServiceComponent implements OnInit {

  currentUser: any;
  venue: any;
  menu: any;
  cart: any = []; //for tracking user bottle selections
  totalCost: number = 0;
  processingPayment: boolean = false;

  constructor(
  	private authSvc: AuthService,
  	private location: Location,
  	private router: Router,
  	private rsrvSvc: ReservationService,
    private paymentSvc: PaymentService,
  	public snackBar: MatSnackBar,
  	public dialogRef: MatDialogRef<BottleServiceComponent>,
  	@Inject(MAT_DIALOG_DATA) public data: any) { 
  		this.menu = data.menu;
  		this.venue = data.venue;
  		this.currentUser = authSvc.getCurrentUser().uid;
  }

  ngOnInit() {
  }

  addToCart(item, amount){

  	//prep object
  	let bottle = {name: '', value: 0, quantity: 0};

  	bottle.name = item.payload.val().name;
  	bottle.value = item.payload.val().price;
  	bottle.quantity = amount;

  	//first check if bottle exists in cart
  	if(this.checkCart(item)){
  		//if so, increment 'specific' bottle count
  		this.addBottles(bottle);
  	}else{

	  	//otherwise add to cart normally
	  	this.cart.push(bottle);
	  	//console.log(this.cart);
	}

	//update total cost which gets displayed in the DOM
  	this.totalCost = this.calculatePrice();
  }

  placeOrder(val){
  	//console.log("Total cart value is: ", this.totalCost);
  	//console.log("Cart contents are: ", this.cart);
  	//console.log("Form value IS: ", val);

  	let order = {bottles: this.cart, totalValue: this.totalCost};

    //set spinner to show
    this.processingPayment = true;

  	//CHARGE USER ACCOUNT
    //first check if user has payment info on file
    this.paymentSvc.getPaymentInfo()
      .subscribe(res => {
        //console.log(res);

        if(res){
          //console.log("Proceeding with charge operation");

          //charge card with token
          this.paymentSvc.chargeUser(this.currentUser, this.totalCost)
            .subscribe(res => {
              //console.log(res);

              //card charged successfuly, create barcode 

              //store transaction details for venue
              this.rsrvSvc.newBottleServiceReservation(this.currentUser, order, this.venue, val.date, val.numofGuests, (() => { this.close(); this.successSnackbar(); }));

            }, err => {
              console.log(err);

              this.snackBar.open('Transaction failed, please review your payment settings', '', {duration: 5000});

              //hide spinner 
              this.processingPayment = false;
            });

        }
      });
    
  }

  calculatePrice(): number{
  	//for each item in cart add price
  	let cart = this.cart;
  	let sum = 0; //var for calculating total cart cost

  	//iterate over contents
  	for(var i = 0; i < cart.length; i++){
  		sum += cart[i].quantity * cart[i].value;
  	}

  	return sum;
  }

  //checks cart to see if item is already added
  checkCart(item): boolean{
  	let cart = this.cart;

  	//iterate through cart looking for item with name
  	for(var i = 0; i < cart.length; i++){
  		
  		if(item.payload.val().name === cart[i].name){
  			//console.log("Item already added");
  			return true;
  		}
  	}
  	return false;
  }

  //for increasing number of bottles of a specific bottle
  addBottles(bottle){
  	let cart = this.cart;

  	//iterate through cart looking for item with name
  	for(var i = 0; i < cart.length; i++){
  		
  		if(bottle.name === cart[i].name){
  			//console.log("Increasing # of bottles of: ", bottle.name);
  			cart[i].quantity += bottle.quantity; 
  		}
  	}

  	//update cart
  	this.cart = cart;

  	//console.log("new cart is: ", this.cart);
  }

  //removes bottle from a users cart
  remove(index){
  	//console.log("Removing: ", index);

  	this.cart.splice(index, 1);
  }

  close(){
  	this.dialogRef.close();
    this.processingPayment = false; //payment processing is complete
  }

  //show success snackbar
  successSnackbar(){
  	let message = 'Your reservation has been made successfully';
  	let snackRef = this.snackBar.open(message, '', {duration: 2000});

  	snackRef.afterDismissed().subscribe(() => {
  		this.router.navigate(['/profile/my-reservations']);
  	})
  }

}
