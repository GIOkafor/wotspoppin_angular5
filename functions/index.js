const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


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
