import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('should emit true when first request starts', (done) => {
      service.loading$.subscribe(loading => {
        expect(loading).toBe(true);
        done();
      });

      service.show();
    });

    it('should only emit true once for multiple concurrent requests', () => {
      let emitCount = 0;
      service.loading$.subscribe(loading => {
        if (loading) emitCount++;
      });

      service.show();
      service.show();
      service.show();

      expect(emitCount).toBe(1);
    });
  });

  describe('hide', () => {
    it('should emit false when all requests complete', (done) => {
      service.show();

      service.loading$.subscribe(loading => {
        if (!loading) {
          expect(loading).toBe(false);
          done();
        }
      });

      service.hide();
    });

    it('should only emit false when activeRequests reaches zero', () => {
      let emitCount = 0;
      service.loading$.subscribe(loading => {
        if (!loading) emitCount++;
      });

      service.show();
      service.show();
      service.show();

      service.hide(); // 2 active
      expect(emitCount).toBe(0);

      service.hide(); // 1 active
      expect(emitCount).toBe(0);

      service.hide(); // 0 active
      expect(emitCount).toBe(1);
    });
  });

  describe('request tracking', () => {
    it('should correctly track active requests count', () => {
      service.show();
      service.show();
      service.show();

      service.hide();
      service.hide();
      service.hide();

      // After all hides, next show should emit true
      let emitted = false;
      service.loading$.subscribe(loading => {
        if (loading) emitted = true;
      });

      service.show();
      expect(emitted).toBe(true);
    });
  });
});
