import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFMComponent } from './upload-fm.component';

describe('UploadFMComponent', () => {
  let component: UploadFMComponent;
  let fixture: ComponentFixture<UploadFMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
