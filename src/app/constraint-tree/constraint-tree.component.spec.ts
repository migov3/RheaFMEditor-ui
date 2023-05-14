import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstraintTreeComponent } from './constraint-tree.component';

describe('ConstraintTreeComponent', () => {
  let component: ConstraintTreeComponent;
  let fixture: ComponentFixture<ConstraintTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConstraintTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstraintTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
