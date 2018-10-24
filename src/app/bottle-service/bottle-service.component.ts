import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '../services/auth.service';
import { ReservationService } from '../services/reservation.service';
import { PaymentService } from '../services/payment.service';
import { TaxService } from '../services/tax.service';

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
  bottleCount: number = 0;
  minSpend: number; //for tracking minimum spend per order for venues
  minError: boolean = false;
  tax: number;
  province: any; //for calculating tax based on province
  boothsAvailable: number;

  constructor(
  	private authSvc: AuthService,
  	private location: Location,
  	private router: Router,
  	private rsrvSvc: ReservationService,
    private paymentSvc: PaymentService,
    private taxSvc: TaxService,
  	public snackBar: MatSnackBar,
  	public dialogRef: MatDialogRef<BottleServiceComponent>,
  	@Inject(MAT_DIALOG_DATA) public data: any) {
  		this.menu = data.menu;
  		this.venue = data.venue;
  		this.currentUser = authSvc.getCurrentUser().uid;
      //get min spend for venue and assign to var
      this.rsrvSvc.getMinSpend(this.venue)
        .subscribe((res: number) => {
          this.minSpend = res;
          //console.log("Min spend is: ", this.minSpend);
        });

      //get province
      this.rsrvSvc.getProvince(this.venue)
        .subscribe(res => {
          this.province = res;
        })
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

      //show message to user
      this.snackBar.open('Item added to cart', '', {duration: 2000});
	}

    //update total cost which gets displayed in the DOM
  	this.totalCost = this.calculatePrice();
    //calculate tax
    this.tax = this.taxSvc.calculateTaxes(this.totalCost, this.province);

    //calculate gratuity
    //show tax in dom to user
    //include gratuity automatically
    this.bottleCount = this.countBottles();

    //check cart value and toggle 'order' button accordingly
    //include tax in total cost calculation
    var costTotal = this.totalCost + this.tax;
    this.minError = this.compareMinSpend(costTotal, this.minSpend);
  }

  //check if order has all information necessary to process order
  //place order if it does, otherwise show error message
  checkOrder(val, fn) {
    console.log("Form value IS: ", val);
    //perform checks and call func
    if(val.numofGuests && val.date !== "" && val.bottleCount && this.boothsAvailable > 0){
      this.placeOrder(val);
    }else if(!val.numofGuests){
      console.log("Error occured: check num of guests");
      this.snackBar.open('Error occured: check your number of guests', '', {duration: 3000});
    }else if(!val.date){
      console.log("Error occured: no date");
      this.snackBar.open('No date specified', '', {duration: 3000});
    }else if(!val.bottleCount){
      console.log("Error occured: check your cart");
      this.snackBar.open('Error occured: check your cart', '', {duration: 3000});
    }else if(this.boothsAvailable < 1){
      console.log("Error occured: no booths available for select date");
      this.snackBar.open('No booths available for date selected', '', {duration: 3000});
    }else{
      console.log("An error occured");
      this.snackBar.open('An error occured', '', {duration: 3000});
    }
  }

  placeOrder(val){
  	//console.log("Total cart value is: ", this.totalCost);
  	//console.log("Cart contents are: ", this.cart);
  	//console.log("Form value IS: ", val);

  	let order = {bottles: this.cart, totalValue: this.totalCost, numberOfBottles: this.bottleCount};

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
          //combine bottle cost with taxes
          var subtotal = this.tax + this.totalCost;
          this.paymentSvc.chargeUser(this.currentUser, subtotal)
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

  countBottles(): number{
    let crt = this.cart;
    let bottles = 0; //var for keeping track of bottle count

    for(var i = 0; i < crt.length; i++){
      bottles += crt[i].quantity;
    }

    return bottles;
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

  	//show message to user
    //console.log("Adding item to cart...");
    this.snackBar.open('Item added to cart', '', {duration: 2000});
  }

  //compare price of all items in user cart with minimum spend amount specified by venue
  compareMinSpend(val, minSpend){
    //console.log('Value: ', val);
    //console.log('Min Value: ', minSpend);

    if(val < minSpend)
      return true;
    else
      return false;
  }

  //removes bottle from a users cart
  remove(index){

    this.cart.splice(index, 1);

    //update total cost which gets displayed in the DOM
  	this.totalCost = this.calculatePrice();
    this.bottleCount = this.countBottles();
    //calculate tax
    this.tax = this.taxSvc.calculateTaxes(this.totalCost, this.province);

    //check cart value and toggle 'order' button accordingly
    this.minError = this.compareMinSpend(this.totalCost, this.minSpend);
  }

  close(){
  	this.dialogRef.close();
    this.processingPayment = false; //payment processing is complete
  }

  //checks to see if venue has reservations available for the date selected by user
  dateChanged($event){
    //console.log("Date changed");
    //console.log($event);

    //call function func(venue_key, date_str)
    //this.rsrvSvc.getAvailableBooths(this.venue, $event);
    //console.log(this.boothsAvailable);

    //local variables for func
    var boothCount = 0;
    var reservationsMade = 0;
    var date = $event;

    this.rsrvSvc.getVenueReservationLimit(this.venue)
      .subscribe((res) => {
        boothCount = res;
        if(!res){
          // WHAT TO DO IF VENUE DOESNT SPECIFY THEIR TABLE LIMIT
          //set to 5 and let user carry on, because venue still has to confirm the reservation in the end
          boothCount = 5;
        }
        console.log("Booth count is: ", boothCount);

        //now get all reservations made for
        this.rsrvSvc.getVenueReservationsValues(this.venue)
        .subscribe((result) => {
          //console.log(result);

          //store all reservations made on particular night for venue in variable
          var allReservations = result.filter(rs => {
            if(rs.date === date && rs.status === 'confirmed')
              return true;
          });

          //console.log(allReservations);
          //calculate how many there are and store in variable
          reservationsMade = allReservations.length;
          console.log("Reservations made at venue on select date: ", reservationsMade);

          //compare to see if they have spots available still
          var difference = 0;
          if(reservationsMade < boothCount)
            difference = boothCount - reservationsMade;

          //return difference
          console.log("Booths available: ", difference);
          this.boothsAvailable = difference;
        });
      });
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
