import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class TicketsService {

  constructor(
  	private db: AngularFireDatabase,
  	private snackBar: MatSnackBar,
  	private router: Router) { }

  buyTicket(order){
  	this.db.list('ticket-purchases')
  		.push(order)
  		.then(res => {
  			let snackRef = this.snackBar.open('Ticket successfully purchased', '', {duration: 3000});
  			snackRef.afterDismissed()
  				.subscribe(() => {
  					this.router.navigate(['/profile/my-reservations']);
  				})
  		})
  }

  getTickets(user){
  	//get all tickets purchased by user with uid 
  	return this.db.list('ticket-purchases', ref => ref.orderByChild('user').equalTo(user))
  		.snapshotChanges();
  }

}
