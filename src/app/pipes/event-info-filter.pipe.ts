import { Pipe, PipeTransform } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Pipe({
  name: 'eventInfoFilter'
})
export class EventInfoFilterPipe implements PipeTransform {

  constructor(private db: AngularFireDatabase){}

  transform(value: any, args?: any): any {
       
	    if(!args)	
	    	return this.db.object('Events/' + value).valueChanges();
	    else if(args === 'name')
	    	return this.db.object('Events/' + value + '/name').valueChanges();
	    else if(args === 'date')
	    	return this.db.object('Events/' + value + '/date').valueChanges();

  }

}
