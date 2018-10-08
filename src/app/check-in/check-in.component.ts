import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { BarcodeValidatorService } from "../services/barcode-validator.service";
import { BarcodeScannerService } from "../services/barcode-scanner.service";
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.css']
})
export class CheckInComponent implements OnInit, OnDestroy {

    @ViewChild('isbn') isbn;
  @ViewChild('fileInputbox') fileInputbox;
  
  resultUrl: any;
  resultCode: any;
  startProgress: boolean = false;
  error: any;
  message: string;
  
  code$ = new Subject<any>();
  
  
  constructor(private sanitizer: DomSanitizer,
              private barcodeValidator: BarcodeValidatorService,
              private decoderService: BarcodeScannerService) {}
  
  ngOnInit() {
    this.barcodeValidator.doSearchbyCode(this.code$)
        .subscribe(
          res => this.message = res,
          err => {
            this.message = `An Error! ${err.json().error}`
          }
        );
  }
  
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  
  setStartProgress() {
    this.startProgress = !this.startProgress;
  }
  
  onChange(e) {
    const file = URL.createObjectURL(e.target.files[0]);
    this.decoderService
        .onDecodeSingle(file)
        .then(code => {
          this.setStartProgress();
          this.resultUrl = this.sanitize(file);
          this.isbn.value = code;
          this.resultCode = code;//use this code to checkin user, ie it's the barcode string
          this.code$.next(code);
        })
        .catch(e => {
          this.resultUrl = '';
          this.resultCode = '';
          this.isbn.value = '';
          this.setStartProgress();
          this.error = `Something is wrong: ${e}`;
        });
  }
  
  onCancel(e) {
    this.setStartProgress();
    this.error = `Something is wrong: Please Select An Image`;
  }
  
  onClick() {
    this.setStartProgress();
    this.fileInputbox.nativeElement.click();
    this.error = null;
  }
  
  ngOnDestroy() {
    console.info('Stopped!')
  }

  checkinUser(code){
  	console.log("Barcode string is ", code);
  	//this should return info for user ticket on result page and
  	//check them in which propageates message across app
  }

}
