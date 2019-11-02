import { TestBed, inject } from '@angular/core/testing';

import { RankingService } from './ranking.service';

describe('RankingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RankingService]
    });
  });

  it('should be created', inject([RankingService], (service: RankingService) => {
    expect(service).toBeTruthy();
  }));
});
