import { TestBed, inject } from '@angular/core/testing';

import { ProfileEditsService } from './profile-edits.service';

describe('ProfileEditsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileEditsService]
    });
  });

  it('should be created', inject([ProfileEditsService], (service: ProfileEditsService) => {
    expect(service).toBeTruthy();
  }));
});
