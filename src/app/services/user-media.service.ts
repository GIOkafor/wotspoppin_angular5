import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class UserMediaService {

  constructor(
  	private db: AngularFireDatabase) { }

  //take uid as arg and return media that belongs to user
  getUserPhotos(uid:string){
  	return this.db.list('uploads', ref => ref.orderByChild('userUid').equalTo(uid)).snapshotChanges();
  }
}
