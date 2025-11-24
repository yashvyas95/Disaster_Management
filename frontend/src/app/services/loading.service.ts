import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new Subject<boolean>();
  public loading$ = this.loadingSubject.asObservable();
  private activeRequests = 0;

  constructor() {}

  show(): void {
    this.activeRequests++;
    if (this.activeRequests === 1) {
      this.loadingSubject.next(true);
    }
  }

  hide(): void {
    this.activeRequests--;
    if (this.activeRequests === 0) {
      this.loadingSubject.next(false);
    }
  }
}
