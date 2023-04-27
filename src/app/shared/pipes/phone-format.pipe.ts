import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneFormat',
})
export class PhoneFormatPipe implements PipeTransform {
  transform(value?: string | null): string | null {
    if (!value) {
      return '';
    }

    const phoneNumber = value.trim().replace(/^8/, '+7');
    const regex = /^(?:\+7\s?)?\(?(\d{3})\)?[\s-]?(\d{3})[\s-]?(\d{2})[\s-]?(\d{2})$/;
    const matches = phoneNumber.match(regex);

    if (!matches) {
      return phoneNumber;
    }

    return `+7 (${matches[1]}) ${matches[2]}-${matches[3]}-${matches[4]}`;
  }
}

@NgModule({
  declarations: [PhoneFormatPipe],
  exports: [PhoneFormatPipe],
  providers: [PhoneFormatPipe],
})
export class PhoneFormatModule {}
