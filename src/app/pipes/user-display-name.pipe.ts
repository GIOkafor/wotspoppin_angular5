import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Pipe({
  name: 'userDisplayName'
})
export class UserDisplayNamePipe implements PipeTransform {

  constructor(private db: AngularFireDatabase){

  }
  transform(value: any, args?: any): any {
    return this.db.object('Users/' + value + '/userInfo/displayName').valueChanges();
  }

}
