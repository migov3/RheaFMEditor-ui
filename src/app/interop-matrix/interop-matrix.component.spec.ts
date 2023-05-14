import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteropMatrixComponent } from './interop-matrix.component';

describe('InteropMatrixComponent', () => {
  let component: InteropMatrixComponent;
  let fixture: ComponentFixture<InteropMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteropMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteropMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
