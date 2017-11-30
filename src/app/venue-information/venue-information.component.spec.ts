import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueInformationComponent } from './venue-information.component';

describe('VenueInformationComponent', () => {
  let component: VenueInformationComponent;
  let fixture: ComponentFixture<VenueInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenueInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenueInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
