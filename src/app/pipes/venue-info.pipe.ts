import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@Pipe({
  name: 'venueInfo'
})

//no argument passed, return full venue object
//parsing takes place on front end

export class VenueInfoPipe implements PipeTransform {

  constructor(private db: AngularFireDatabase){}

  transform(value: any, args?: any): any {
	
    return this.db.list('Venues/', ref => ref.orderByChild('name').equalTo(value)).valueChanges();
  }

}
