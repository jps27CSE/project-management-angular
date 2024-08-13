import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true,
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Convert the date-time string to a Date object
    const date = new Date(value);
    // Format the date to YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }
}
