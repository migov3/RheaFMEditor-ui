import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanticsMetricsComponent } from './semantics-metrics.component';

describe('SemanticsMetricsComponent', () => {
  let component: SemanticsMetricsComponent;
  let fixture: ComponentFixture<SemanticsMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemanticsMetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanticsMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
