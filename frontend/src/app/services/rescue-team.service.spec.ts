import { TestBed } from '@angular/core/testing';

import { RescueTeamService } from './rescue-team.service';

describe('RescueTeamService', () => {
  let service: RescueTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RescueTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
