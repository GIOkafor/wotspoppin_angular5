import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'inviteFilter'
})

//checks list of sent invites to see if an invite has been sent to user with uid passed as arg
export class InviteFilterPipe implements PipeTransform {

	constructor(
		private db: AngularFireDatabase,
		private authSvc: AuthService){}

  transform(value: any, args1: any): any {

    var myUid = this.authSvc.getCurrentUser().uid;

    //console.log('Users/' + myUid + '/sentInvites/' + args1);

    return this.db.list('Users/' + myUid + '/sentInvites/' + args1, ref => ref.orderByChild('user').equalTo(value)).valueChanges();
  }

}
