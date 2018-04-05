import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInScannerComponent } from './check-in-scanner.component';

describe('CheckInScannerComponent', () => {
  let component: CheckInScannerComponent;
  let fixture: ComponentFixture<CheckInScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
