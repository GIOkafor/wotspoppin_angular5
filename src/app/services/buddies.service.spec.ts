import { TestBed, inject } from '@angular/core/testing';

import { BuddiesService } from './buddies.service';

describe('BuddiesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BuddiesService]
    });
  });

  it('should be created', inject([BuddiesService], (service: BuddiesService) => {
    expect(service).toBeTruthy();
  }));
});
