import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'locale',
})
export class LocalePipe implements PipeTransform {

  transform(value: Record<string, string>): string {
    return value[window.locale] || value[''] || '';
  }
}
