import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottleServiceComponent } from './bottle-service.component';

describe('BottleServiceComponent', () => {
  let component: BottleServiceComponent;
  let fixture: ComponentFixture<BottleServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottleServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottleServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
