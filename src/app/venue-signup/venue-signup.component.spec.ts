import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueSignupComponent } from './venue-signup.component';

describe('VenueSignupComponent', () => {
  let component: VenueSignupComponent;
  let fixture: ComponentFixture<VenueSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
