import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from "ngx-stripe";
import { HttpClient } from '@angular/common/http';
import { PaymentService } from '../services/payment.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-stripe-test',
  templateUrl: './stripe-test.component.html',
  styleUrls: ['./stripe-test.component.css']
})
export class StripeTestComponent implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  processing: boolean = false;

  cardOptions: ElementOptions = {
    style: {
      base: {
        iconColor: '#e18047',
        color: '#fff',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };

  elementsOptions: ElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private http: HttpClient,
    private paymentSvc: PaymentService,
    private location: Location,
    private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
  }


  //update user payment settings
  buy(ev) {
    //show spinner
    this.processing = true;

    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card.getCard(), { name })
      .subscribe(result => {
        if (result.token) {
          // Use the token to create a charge or a customer
          // https://stripe.com/docs/charges
          console.log(result.token.id);

          //show success message
          this.snackBar.open('Payment settings successfully updated', '', {duration: 5000});

          //store token for later use
          this.storeToken(result.token.id);

          //hide spinner, operation is finished
          this.processing = false;
          
        } else if (result.error) {
          // Error creating the token
          console.log(result.error.message);

          //show error message
          this.snackBar.open('Payment settings could not be update successfully', '', {duration: 5000});
          
          //hide spinner, operation is finished
          this.processing = false;
        }
      });
  }

  storeToken(tkn){
    this.paymentSvc.storeTkn(tkn);
  }

  goBack(){
    this.location.back();
  }
}
