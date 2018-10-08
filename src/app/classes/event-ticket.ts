export class EventTicket{
	venue: any;
	user: any;
	datePurchased: number;
	eventDate: number;
	price: number;
	eventKey: any;

	constructor(
		venue: any,
		user: any,
		datePurchased: number,
		eventDate: number,
		price: number,
		eventKey: any){
			this.venue = venue;
			this.user = user;
			this.datePurchased = datePurchased;
			this.eventDate =  eventDate;
			this.price = price;
			this.eventKey = eventKey;
	}
}
