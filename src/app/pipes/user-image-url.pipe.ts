import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Pipe({
  name: 'userImageUrl'
})

//accepts user uid as argument and returns user imageUrl from db
export class UserImageUrlPipe implements PipeTransform {

  constructor(private db: AngularFireDatabase){

  }

  transform(value: any, args?: any): any {

    let imageUrl = '';
    return this.db.object('/Users/' + value + '/userInfo/imageUrl').valueChanges();
  }

}
