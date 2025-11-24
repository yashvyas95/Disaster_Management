import { TestBed } from '@angular/core/testing';

import { VictimServicesService } from './victim-services.service';

describe('VictimServicesService', () => {
  let service: VictimServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VictimServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
