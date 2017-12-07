import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class BuddiesService {

  constructor(
  	private db: AngularFireDatabase) { }

  getUserBuddies(uid: string){
  	return this.db.list('Users/' + uid + '/buddies').valueChanges();
  }
}
