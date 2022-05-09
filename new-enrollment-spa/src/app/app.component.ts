import { Component } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  loading$ = this.loadingService.loading$;

  constructor(private loadingService: LoadingService) { }
}
