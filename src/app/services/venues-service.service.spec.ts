import { TestBed, inject } from '@angular/core/testing';

import { VenuesServiceService } from './venues-service.service';

describe('VenuesServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VenuesServiceService]
    });
  });

  it('should be created', inject([VenuesServiceService], (service: VenuesServiceService) => {
    expect(service).toBeTruthy();
  }));
});
