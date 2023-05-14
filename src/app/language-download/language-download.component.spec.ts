import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageDownloadComponent } from './language-download.component';

describe('LanguageDownloadComponent', () => {
  let component: LanguageDownloadComponent;
  let fixture: ComponentFixture<LanguageDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
