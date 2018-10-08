import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class BuddiesService {

  constructor(
  	private db: AngularFireDatabase) { }

  getUserBuddies(uid: string){
  	return this.db.list('Users/' + uid + '/buddies').valueChanges();
  }

  //for getting user buddies with metadata attached
  getUserBuddiesMeta(uid: string){
  	return this.db.list('Users/' + uid + '/buddies').snapshotChanges();
  }

  getBuddyRequests(uid: string){
  	return this.db.list('Users/' + uid + '/sent-friend-requests').valueChanges();
  }

  removeFriend(myUid, buddyUid){
  	let otherKey, myKey;

	//find my key in other user's list of buddies
	this.db.list('Users/' + buddyUid + '/buddies', ref => ref.orderByValue().equalTo(myUid)).snapshotChanges()
		.subscribe(res => {
			myKey = res;
			console.log("My key is: ", myKey[0].payload.key);

			//remove me from their buddy list
			this.remove(buddyUid, myKey[0].payload.key);

			this.db.list('Users/' + myUid + '/buddies', ref => ref.orderByValue().equalTo(buddyUid)).snapshotChanges()
				.subscribe(result => {
					otherKey = result;
					console.log("Other key is: ", otherKey[0].payload.key);

					//remove them from my list
					this.remove(myUid, otherKey[0].payload.key);
				})
		})

  }

  remove(userUid, key){
  	this.db.list('Users/' + userUid + '/buddies')
  		.remove(key)
  		.then(_=> console.log("Success"));
  }
}
