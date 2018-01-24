import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeTestComponent } from './stripe-test.component';

describe('StripeTestComponent', () => {
  let component: StripeTestComponent;
  let fixture: ComponentFixture<StripeTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
