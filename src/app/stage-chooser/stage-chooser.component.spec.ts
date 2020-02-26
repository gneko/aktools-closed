import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageChooserComponent } from './stage-chooser.component';

describe('StageChooserComponent', () => {
  let component: StageChooserComponent;
  let fixture: ComponentFixture<StageChooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageChooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
