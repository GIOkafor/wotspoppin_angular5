import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVenuesComponent } from './my-venues.component';

describe('MyVenuesComponent', () => {
  let component: MyVenuesComponent;
  let fixture: ComponentFixture<MyVenuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyVenuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
