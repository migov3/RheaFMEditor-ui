import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationNodeComponent } from './relation-node.component';

describe('RelationNodeComponent', () => {
  let component: RelationNodeComponent;
  let fixture: ComponentFixture<RelationNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelationNodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelationNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
