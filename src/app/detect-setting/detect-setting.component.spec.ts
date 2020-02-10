import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectSetttingComponent } from './detect-setting.component';

describe('AutoDetectComponent', () => {
  let component: DetectSetttingComponent;
  let fixture: ComponentFixture<DetectSetttingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetectSetttingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetectSetttingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
