import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class MessagingService {

  msgThread: any;

  constructor(
  	private db: AngularFireDatabase) { }

  //gets all messages belonging to user who's uid is supplied
  getMessages(uid: string){
  	return this.db.list('Users/' + uid + '/dms').snapshotChanges()
  		.map(messages => {
  			return messages.map(msgs => ({ key: msgs.payload.key, val: msgs.payload.val() }));
  		})
  }

  //gets messages related to thread specified
  getThreadMessages(uid: string, threadId: string){
  	return this.db.list('Users/' + uid + '/dms/' + threadId).valueChanges();
  }

  //adds message to thread
  addMessage(uid: string, threadId: string, msg: any){
  	console.log("Adding message: ", msg);

  	const promise = this.db.list('Users/' + uid + '/dms/' + threadId).push(msg);
  	promise
  		.then(_=>{
  			this.db.list('Users/' + threadId + '/dms/' + uid).push(msg);//send message to other user involved
  			console.log('success');
  		});
  }
}
