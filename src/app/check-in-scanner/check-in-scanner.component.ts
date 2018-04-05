import { Component, OnInit, OnDestroy, ViewChild, AfterContentInit } from '@angular/core';
import { BarcodeScannerService } from "../services/barcode-scanner.service";
import { BarcodeValidatorService } from "../services/barcode-validator.service";
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'app-check-in-scanner',
  templateUrl: './check-in-scanner.component.html',
  styleUrls: ['./check-in-scanner.component.css']
})
export class CheckInScannerComponent implements OnInit, OnDestroy, AfterContentInit {
  
  lastResult: any;
  message: any;
  error: any;
  
  code$ = new Subject<any>();
  
  @ViewChild('interactive') interactive;

  constructor(
  	private decoderService: BarcodeScannerService,
  	private barcodeValidator: BarcodeValidatorService) { }

  ngOnInit() {
  	this.decoderService.onLiveStreamInit();
    this.decoderService.onDecodeProcessed();
    
    this.decoderService
        .onDecodeDetected()
        .then(code => {
          this.lastResult = code;//use this for cross-referencing user reservation
          this.code$.next(code);
        })
        .catch((err) => this.error = `Something Wrong: ${err}`);
    
    this.barcodeValidator
        .doSearchbyCode(this.code$)
        .subscribe(
          res => this.message = res,
          err => {
            this.message = `An Error! ${err.json().error}`
          }
        );
  }
  
  ngAfterContentInit() {
    this.interactive.nativeElement.children[0].style.position = 'absolute';
  }
  
  ngOnDestroy() {
    this.decoderService.onDecodeStop();
  }

}
