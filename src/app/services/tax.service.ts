import { Injectable } from '@angular/core';

@Injectable()
export class TaxService {

  constructor() { }

  getRate(province): number{
    //return the percentage tax charged in selected province
    console.log('Getting rate for province: ', province);

    var rate = 0;

    switch(province){
        case 'AB':
          rate = 5;
          break;
        case 'BC':
          rate = 12;
          break;
        case 'MA':
          rate = 13;
          break;
        case 'NB':
          rate = 15;
          break;
        case 'NL':
          rate = 15;
          break;
        case 'NT':
          rate = 5;
          break;
        case 'NS':
          rate = 15;
          break;
        case 'NU':
          rate = 5;
          break;
        case 'ON':
          rate = 13;
          break;
        case 'PE':
          rate = 15;
          break;
        case 'QC':
          rate = 14.975;
          break;
        case 'YT':
          rate = 5;
          break;
    }

    return rate;
  }

  calculateTaxes(val, province): number{
    //takes a number and return the percentage tax based on input
    console.log('Calculating taxes for order amounting to: ', val + ' belonging to user in: ' + province.value);

    //first get rate
    var rate = this.getRate(province.short);

    //do calculation
    // taxes = r/100 * val
    var taxes = ((rate/ 100) * val);

    //display value to user
    console.log("Your taxes are: $", taxes);
    return taxes;
  }

}
