export class Ticket {
	venue: any;
	user: any;
	datePurchased: number;
	eventDate: number;
	price: number;

	constructor(
		venue: any,
		user: any,
		datePurchased: number,
		eventDate: number,
		price: number){
			this.venue = venue;
			this.user = user;
			this.datePurchased = datePurchased;
			this.eventDate =  eventDate;
			this.price = price;
	}
}
