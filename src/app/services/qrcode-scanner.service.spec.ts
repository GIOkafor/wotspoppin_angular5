import { TestBed, inject } from '@angular/core/testing';

import { QrcodeScannerService } from './qrcode-scanner.service';

describe('QrcodeScannerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QrcodeScannerService]
    });
  });

  it('should be created', inject([QrcodeScannerService], (service: QrcodeScannerService) => {
    expect(service).toBeTruthy();
  }));
});
