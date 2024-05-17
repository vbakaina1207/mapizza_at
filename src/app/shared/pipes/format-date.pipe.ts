import { Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import { Timestamp } from '@angular/fire/firestore'
import { formatDate } from '@angular/common';

@Pipe({
  name: 'formatDates'
})
export class FormatDatePipe implements PipeTransform {
  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  transform(timestamp: Timestamp, format?: string): string {
    if (!timestamp?.toDate) {
      return '';
    }
    return formatDate(timestamp.toDate(), format || 'MMM-yyyy', this.locale);
  }

}
