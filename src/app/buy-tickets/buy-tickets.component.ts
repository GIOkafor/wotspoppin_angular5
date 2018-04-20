import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { PaymentService } from '../services/payment.service';
import { AuthService } from '../services/auth.service';
import { AngularFireDatabase } from 'angularfire2/database';
import { TicketsService } from '../services/tickets.service';

@Component({
  selector: 'app-buy-tickets',
  templateUrl: './buy-tickets.component.html',
  styleUrls: ['./buy-tickets.component.css']
})
export class BuyTicketsComponent implements OnInit {

  currentUser: any;
  venue: any;
  events$: any; //all events venue has ever created
  events: any = []; //venues parsed by current date
  date: boolean = false;//used to show ticket purchase selection method
  loading: boolean = false; //used to indicate that payment is processing

  constructor(
  	private authSvc: AuthService,
  	private paymentSvc: PaymentService,
  	private db: AngularFireDatabase,
  	private ticketsSvc: TicketsService,
  	private snackBar: MatSnackBar,
  	public dialogRef: MatDialogRef<BuyTicketsComponent>,
  	@Inject(MAT_DIALOG_DATA) public data: any) { 
  		this.venue = data.venue;
  		this.currentUser = authSvc.getCurrentUser().uid;
  		this.getVenueEvents();
  }

  ngOnInit() {
  }

  getVenueEvents(){
  	this.db.list('/Events', ref => ref.orderByChild("createdBy").equalTo(this.venue.payload.val().createdBy))
  	.snapshotChanges()
	.subscribe(res => {
		this.events$ = res;
		this.parseEvents(res);
	});
  }

  //go through event list and differentiate past events from upcoming
  parseEvents(events){
  	let currentDate = Date.now();

  	//simply filter by magnitude, so once time passes it is no longer possible to purchase by event
  	for(var i = 0; i < events.length; i++){
  		if(events[i].payload.val().date > currentDate){
  			this.events.push(events[i]);
  		}
  	}
  }

  buyTicket(price){
  	//ticket price, venue name, event name, date purchased

  	let currentUser = this.authSvc.getCurrentUser().uid;

  	let order = {
  		venue: '',
  		user: currentUser,
  		datePurchased: Date.now(),
  		price: price
  	};

  	order.venue = this.venue.key;

  	console.log("buying ticket: ", order);

  	//show loading spinner
  	this.loading = true;

  	this.paymentSvc
  		.getPaymentInfo()
	  	.subscribe(res => {

	        if(res){

	          //charge card with token
	          this.paymentSvc.chargeUser(currentUser, order.price)
	            .subscribe(res => {
	              //console.log(res);

	              //card charged successfuly, create barcode 

	              //store transaction details for venue
	              this.ticketsSvc.buyTicket(order);

	              //hide spinner 
	              this.loading = false;

	              //close modal
	              this.dialogRef.close();

	            }, err => {
	              console.log(err);

	              this.snackBar.open('Transaction failed, please review your payment settings', '', {duration: 5000});

	              //hide spinner 
	              this.loading = false;
	            });

	        }
	      });
  }

}
