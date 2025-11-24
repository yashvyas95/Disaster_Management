import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

interface CacheEntry {
  response: HttpResponse<any>;
  timestamp: number;
}

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache = new Map<string, CacheEntry>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  // URLs that should be cached
  private readonly CACHEABLE_URLS = [
    '/department/getAll',
    '/auth/userByUsername',
    '/rescueTeam/getById'
  ];

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // Check if this URL should be cached
    const shouldCache = this.CACHEABLE_URLS.some(url => req.url.includes(url));
    if (!shouldCache) {
      return next.handle(req);
    }

    // Check cache
    const cachedEntry = this.cache.get(req.urlWithParams);
    if (cachedEntry) {
      const age = Date.now() - cachedEntry.timestamp;
      if (age < this.CACHE_TTL) {
        console.log(`Cache HIT: ${req.urlWithParams} (age: ${Math.round(age / 1000)}s)`);
        return of(cachedEntry.response.clone());
      } else {
        // Cache expired, remove it
        this.cache.delete(req.urlWithParams);
      }
    }

    // Cache miss - make request and cache response
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log(`Cache MISS: ${req.urlWithParams} - caching response`);
          this.cache.set(req.urlWithParams, {
            response: event.clone(),
            timestamp: Date.now()
          });
        }
      })
    );
  }

  // Method to clear cache (can be called when data is updated)
  public clearCache(url?: string): void {
    if (url) {
      // Clear specific URL
      const keysToDelete = Array.from(this.cache.keys()).filter(key => key.includes(url));
      keysToDelete.forEach(key => this.cache.delete(key));
    } else {
      // Clear all cache
      this.cache.clear();
    }
  }

  // Method to get cache statistics
  public getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}
