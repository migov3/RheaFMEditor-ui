import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FMEditorComponent } from './fmeditor.component';

describe('FMEditorComponent', () => {
  let component: FMEditorComponent;
  let fixture: ComponentFixture<FMEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FMEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FMEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
