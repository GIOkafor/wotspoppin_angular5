import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueReservationDetailsComponent } from './venue-reservation-details.component';

describe('VenueReservationDetailsComponent', () => {
  let component: VenueReservationDetailsComponent;
  let fixture: ComponentFixture<VenueReservationDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueReservationDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueReservationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
