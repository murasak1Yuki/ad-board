import { NgModule, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

moment.locale('ru');

@Pipe({
  name: 'datetime',
})
export class DatetimePipe implements PipeTransform {
  transform(value: number): string {
    return moment(value).fromNow();
  }
}

@NgModule({
  declarations: [DatetimePipe],
  exports: [DatetimePipe],
  providers: [DatetimePipe],
})
export class DatetimeModule {}
