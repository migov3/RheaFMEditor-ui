import { TestBed } from '@angular/core/testing';

import { FmRepositoryService } from './fm-repository.service';

describe('FmRepositoryService', () => {
  let service: FmRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FmRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
