import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendingNotificationComponent } from './attending-notification.component';

describe('AttendingNotificationComponent', () => {
  let component: AttendingNotificationComponent;
  let fixture: ComponentFixture<AttendingNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendingNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendingNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
