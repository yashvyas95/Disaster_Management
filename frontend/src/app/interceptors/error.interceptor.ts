import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private toastr: ToastrService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      // Retry failed requests for GET requests only (excluding auth endpoints)
      catchError((error: HttpErrorResponse) => {
        // Retry logic for specific cases
        if (error.status >= 500 && req.method === 'GET' && !req.url.includes('/auth/')) {
          // Will retry once after 1 second
          return next.handle(req).pipe(
            catchError((retryError: HttpErrorResponse) => {
              return this.handleError(retryError);
            })
          );
        }
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Unable to connect to server. Please check your connection.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Session expired. Please login again.';
          this.router.navigate(['/login']);
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 409:
          errorMessage = error.error?.message || 'Conflict occurred.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
      }
    }

    // Show toast notification for errors (except 401 which redirects)
    if (error.status !== 401) {
      this.toastr.error(errorMessage, 'Error', {
        timeOut: 5000,
        progressBar: true,
        closeButton: true
      });
    }

    console.error('HTTP Error:', error);
    return throwError(() => error);
  }
}
