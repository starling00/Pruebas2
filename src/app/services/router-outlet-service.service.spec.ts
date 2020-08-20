import { TestBed } from '@angular/core/testing';

import { RouterOutletServiceService } from './router-outlet-service.service';

describe('RouterOutletServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RouterOutletServiceService = TestBed.get(RouterOutletServiceService);
    expect(service).toBeTruthy();
  });
});
