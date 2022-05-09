import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoadingService } from './loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  pendingRequestsCount = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.loadingService.show();
    this.pendingRequestsCount++;

    return next.handle(request).pipe(
      finalize(() => {
        this.pendingRequestsCount--;

        if (this.pendingRequestsCount === 0) {
          this.loadingService.hide();
        }
      })
    );
  }
}
