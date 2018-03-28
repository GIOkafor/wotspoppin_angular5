const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

//Map geolocation stuff
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',

  // Optional depending on the providers
  httpAdapter: 'https', 
  apiKey: 'AIzaSyBYjcOcW2Y_CYHp0j_wlsE8LW6DWAoEMUk', 
  formatter: null        
};

var geocoder = NodeGeocoder(options);

//stripe stuff
var stripe = require("stripe")("sk_test_joqW1S4ZWcmtsg2GyLIf5Jon");//test key, CHANGE TO PRODUCTION KEY LATER

/////////////////FUNCTIONS START///////////////////
///////////////////////////////////////////////////////////////////////////////////////////

//adds time uploaded value to media uploaded
exports.timeUploaded = functions.database.ref('/uploads/{key}')
	.onWrite(event => {
		const media = event.data.val();

		//if media has a time assigned exit
		if(media.createdAt)
			return;

		//continue here when no time exists on media uploaded
		return event.data.ref.child('createdAt').set(admin.database.ServerValue.TIMESTAMP);
	});

//change to db trigger
exports.sendEventInvite = functions.database.ref('Users/{uid}/sentInvites/{eventKey}/{objKey}')
	.onWrite(event => {
		// Only trigger when it is first created.
		if (event.data.previous.exists()) {
			return null;
		}

		// Exit when the data is deleted.
		if (!event.data.exists()) {
			return null;
		}

		const inviteInfo = event.data.val();
		console.log("Data received in db is: ");
		console.log(inviteInfo);

		return admin.database().ref('Users/' + inviteInfo.user + '/notifications/invites')
			.push(inviteInfo)
	});

//adds time_sent to sent message and add message to other users portion of db
exports.messageSentTime = functions.database.ref('Users/{uid}/dms/{threadId}/{msgId}')
	.onWrite(event => {
		const msg = event.data.val();

		//if message has a time assigned exit
		if(msg.timeSent)
			return;

		//continue here if time does not exist
		return event.data.ref.child('timeSent').set(admin.database.ServerValue.TIMESTAMP);
		
		/*
			//then send message to other user in thread
			return admin.database().ref('Users/'+ event.data.key + '/dms/' + msg.senderId)
				.push(msg)
		*/
	});

//adds location in lat long when event adress is added upon event creation position{lat,lng}
exports.addLocation = functions.database.ref('Events/{id}')
	.onWrite(event => {
		const evt = event.data.val();

		//console.log("Event is: ", evt);

		//if message has a postion, exit
		if(evt.postion)
			return;

		//if it doesn't, continue here
		geocoder.geocode(evt.address)
			.then(function(res) {
			    //console.log(res);

			    //create object
			    var position = {
			    	lat: '',
			    	lng: ''
			    };

			    //assign values to variables
			    position.lat = res[0].latitude;
			    position.lng = res[0].longitude;

			    //debug code
			    //console.log("Position object is: ", position);

			    //store new value in database
			    return event.data.ref.child('position').set(position);
			})
			.catch(function(err) {
				console.log(err);
				return;
			});
	});

//create customer on stripe via token
exports.createCustomer = functions.database.ref('Users/{uid}/paymentInfo/token')
	.onWrite(event => {
		let evt = event.data.val();
		let userKey = event.params.uid;
		console.log("Data passed is: ",  evt);
		console.log("User key in db is: ", userKey);

		const customer = stripe.customers.create({
			source: evt//set this to token data added in user db
		}, function(err, customer){
			console.log("Customer created is: ");
			console.log(customer);

			//store customer info in db
			return admin.database().ref('Users/' + userKey + '/paymentInfo/details').set(customer)
		});

	})

//charge customer account
exports.chargeCustomer = functions.https.onRequest((req, res) => {
	console.log("Request sent is: ", req.body);

	let uid = req.body.uid;
	let cost = req.body.cost * 100; //this is done because $20 == 2000
	let userPaymentId; //for storing user id created by stripe in db

	//GET USER ID USERS/UID/PAYMENTINFO/DETAILS/ID

	let customerRef = admin.database().ref('Users/' + uid + '/paymentInfo/details/id').once('value')
		.then(function(snapshot){
			userPaymentId = snapshot.val();
			console.log("User stripe id is...");
			console.log(userPaymentId);

			//create charge
			const charge = stripe.charges.create({
				amount: cost,
				currency: "cad",
				customer: userPaymentId
			}, function(err, res){
				if(res){
					console.log("Charge created is...");
					console.log(res);

					//capture charge ...
					stripe.charges.capture(res.id, function(err, ch){
						if(err)
							console.log(err);
						else
							console.log(ch);
					})
				}else{
					console.log("Error is...");
					console.log(err);
				}
			});
		})

	
})