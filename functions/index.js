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

const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const gcs = require('@google-cloud/storage')();
const bucket = gcs.bucket('noteapp-436f9.appspot.com');

/////////////////FUNCTIONS START///////////////////
///////////////////////////////////////////////////////////////////////////////////////////

//adds time uploaded value to media uploaded
exports.timeUploaded = functions.database.ref('/uploads/{key}')
	.onWrite((change, context) => {
		const media = change.after.val();

		//if media has a time assigned exit
		if(media.createdAt)
			return;

		//continue here when no time exists on media uploaded
		return change.after.ref.child('createdAt').set(admin.database.ServerValue.TIMESTAMP);
	});

//change to db trigger
exports.sendEventInvite = functions.database.ref('Users/{uid}/sentInvites/{eventKey}/{objKey}')
	.onWrite((change, context) => {
		// Only trigger when it is first created.
		if (change.before.val()) {
			return null;
		}

		// Exit when the data is deleted.
		if (!change.after.val()) {
			return null;
		}

		const inviteInfo = change.after.val();
		console.log("Data received in db is: ");
		console.log(inviteInfo);

		return admin.database().ref('Users/' + inviteInfo.user + '/notifications/invites')
			.push(inviteInfo)
	});

//adds time_sent to sent message and add message to other users portion of db
exports.messageSentTime = functions.database.ref('Users/{uid}/dms/{threadId}/{msgId}')
	.onWrite((change, context) => {
		const msg = change.after.val();

		//if message has a time assigned exit
		if(msg.timeSent)
			return;

		//continue here if time does not exist
		return change.after.ref.child('timeSent').set(admin.database.ServerValue.TIMESTAMP);
		
		/*
			//then send message to other user in thread
			return admin.database().ref('Users/'+ event.data.key + '/dms/' + msg.senderId)
				.push(msg)
		*/
	});

//adds location in lat long when event adress is added upon event creation position{lat,lng}
exports.addLocation = functions.database.ref('Events/{id}')
	.onWrite((change, context) => {
		const evt = change.after.val();

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
			    return change.after.ref.child('position').set(position);
			})
			.catch(function(err) {
				console.log(err);
				return;
			});
	});

//create customer on stripe via token
exports.createCustomer = functions.database.ref('Users/{uid}/paymentInfo/token')
	.onWrite((change, context) => {
		let evt = change.after.val();
		let userKey = context.params.uid;
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

exports.chargeCustomer = functions.https.onRequest((req, res) => {
	//console.log("Request sent is: ", req.body);
  	//console.log(req.body);

  	//turn string request into json object
  	reqObject = JSON.parse(req.body);
  
	let uid = reqObject.uid;
	let cost = reqObject.cost * 100; //this is done because $20 == 2000
	let userPaymentId; //for storing user id created by stripe in db

  	//console.log("User uid is: ", uid);
  	//console.log("Cost is: ", cost);
  
	//GET USER ID USERS/UID/PAYMENTINFO/DETAILS/ID

	let customerRef = admin.database().ref('Users/' + uid + '/paymentInfo/details/id').once('value')
		.then(function(snapshot){
			userPaymentId = snapshot.val();
			//console.log("User stripe id is...");
			//console.log(userPaymentId);

			//create charge
			const charge = stripe.charges.create({
				amount: cost,
				currency: "cad",
				customer: userPaymentId
			}, function(err, result){
				if(result){
					console.log("Charge created successfully");
					//console.log(result);
                  	
                  	res.header("Access-Control-Allow-Origin", "*");
                  	res.status(200).send(result);

				}else{
					console.log("Error is...");
					//console.log(err);
                  	res.status(200).send(err);
				}
			});
		})

	
})

//update available tickets count
exports.updateAvailableTickets = functions.database.ref('ticket-purchases/{key}')
	.onWrite((change, context) => {
		// Only trigger when it is first created.
		if (change.before.val()) {
			return null;
		}

		// Exit when the data is deleted.
		if (!change.after.val()) {
			return null;
		}


		//if ticket purchased is event ticket
		if(change.after.val().eventKey){
			const eventKey = change.after.val().eventKey;
			console.log("Event key passed is: ", eventKey);

			//search for event with key
			let eventRef = admin.database().ref('Events/' + eventKey + '/availableTickets')
				.once('value', function(snapshot){
					console.log("Event key returned by query is: ", snapshot.key);
					
					let availableTickets = snapshot.val();

					//update count
					console.log("Old count was: ", availableTickets);

					
					availableTickets = availableTickets - 1;

					console.log("New count is: ", availableTickets);

					return admin.database().ref('Events/' + eventKey + '/availableTickets').set(availableTickets);

				}); 
		}
		//USE EVENT KEY INSTEAD!
		//use event date to find event that has date and update availableTickets count appropriately
		/*const eventDate = event.data.val();
		console.log("Event date is: ", eventDate);

		//find event with the same date
		return admin.database().ref('Events')
			.orderByChild('date')
			.equalTo(eventDate)
			.once('value', function(snapshot){
				console.log("Event key is: ", snapshot.key);
				//update count
				admin.database().ref('Events/' + snapshot.key + '/availableTickets')
					.once('value', (val) => {
						console.log("Old count was: ", val);

						const availableTickets = val;
						availableTickets = availableTickets - 1;

						console.log("New count is: ", availableTickets);

						return admin.database().ref('Events/' + snapshot.key + '/availableTickets').set(availableTickets);
					})
			});*/
	})

//resize image on upload cloud function
/*
exports.resizeImage = functions.storage.object().onFinalize(event => {
	const object = event.data;
	const bucket = object.bucket;
	const contentType = object.contentType;
	const filePath = object.name;
	console.log('File change detected, function execution started');

	if(object.resourceState === 'not_exists'){
		console.log("File deleted, exit...");
		return;
	}

	if(path.basename(filePath).startsWith('resized')){
		console.log("We already renamed that file");
		return;
	}

	const destBucket = gcs.bucket(bucket);
	const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
	const metadata = { contentType: contentType };

	return destBucket.file(filePath).download({
		destination: tmpFilePath
	}).then(() => {
		return spawn('convert', [tmpFilePath, '-resize', '500x500', tmpFilePath]);
	}).then(() => {
		return destBucket.upload(tmpFilePath, {
			destination: 'resized-' + path.basename(filePath),
			metadata: metadata
		})
	});
});
*/

//delete user assets on account delete
exports.deleteUser = functions.database.ref('Users/{uid}/delete')
	.onCreate((snapshot, context) => {
		let uid = context.params.uid;

		//get photos belonging to user with info profilePics/userUid, then delete 
		deleteProfilePics(uid);

		//get photos belonging to user in uploads/userUid, then pass it to deleteUploads function 
		deleteUploads(uid); 

		//get reference to user information from db in Users/uid, then delete
		deleteUserInfo(uid);
	});

function deleteProfilePics(uid){
	console.log("deleting profile pics for user with uid: ", uid);

	//get photos belonging to user in profilePics/userUid
	admin.database().ref('profilePics/').once('value')
		.then((snapshot) => {
			let images = snapshot.val();
			//console.log("All images are: ");
			//console.log(images);

			let userImages = []; //for tracking which images belong to particular user

			//for each image in images array, add the ones with uid == userUId to userImages array

			//its not an array

			for(var image in images){
				if(images[image].userUid === uid){
					userImages.push({ key: image, image: images[image] });
				}
			}

			//console.log("User images are: ");
			//console.log(userImages);

			//for each image user has, delete corresponding image in storage bucket
			for(var j = 0; j < userImages.length; j++){
				deleteProfilePic(userImages[j]);
			}
		});
}

function deleteUploads(uid){
	//console.log("deleting uploads for user with uid: ", uid);
	//for each image we delete, delete corresponding image in storage bucket

	//get photos belonging to user in uploads/userUid
	admin.database().ref('uploads/').once('value')
		.then((snapshot) => {
			let uploads = snapshot.val();

			//console.log("All uploads are: ");
			//console.log(uploads);

			let userUploads = []; //for tracking which uploads belong to particular user

			//for each image in uploads array, add the ones with uid == userUId to userUploads array

			//its not an array

			for(var upload in uploads){
				if(uploads[upload].userUid === uid){
					userUploads.push({key: upload, image: uploads[upload]});
				}
			}

			//console.log("User uploads are: ");
			//console.log(userUploads);

			//for each image user has, delete corresponding image in storage bucket
			for(var j = 0; j < userUploads.length; j++){
				deleteUpload(userUploads[j]);
			}
		});
}

function deleteUpload(image){

	//delete file in storage bucket
	var filePath = 'uploads/' + image.image.name;
	var file = bucket.file(filePath);

	// Delete the file
	file.delete().then(function() {
	  console.log("File deleted successfully");
	}).catch(function(error) {
	  console.log("Uh-oh, an error occurred!");
	  console.log(error);
	});

	//delete reference to file in firebase realtime db
	admin.database().ref('uploads/' + image.key).remove();
}

function deleteProfilePic(image){
	//console.log("Deleting image ", image.key);

	var imagePath = 'profilePics/' + image.image.name;
	var file = bucket.file(imagePath);

	// Delete the file
	file.delete().then(function() {
	  console.log("File deleted successfully");
	}).catch(function(error) {
	  console.log("Uh-oh, an error occurred!");
	  console.log(error);
	});

	//delete image reference in realtime db
	admin.database().ref('profilePics/' + image.key).remove();
}

function deleteUserInfo(uid){
	console.log("deleting info for user with uid");

	admin.database().ref('Users/' + uid).remove();
}