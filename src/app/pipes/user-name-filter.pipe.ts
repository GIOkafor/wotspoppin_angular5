import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userNameFilter',
  pure: false
})
export class UserNameFilterPipe implements PipeTransform {

  transform(items: any[], searchText: string): any[] {
    if(!items){
    	//console.log("No items");
    	return [];
    }
    if(!searchText){
    	//console.log("No search text");
    	return items;
    }

    return items.filter(it => {
    	it.payload.val().userInfo.displayName === searchText;
    });
  }

}
