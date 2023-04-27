import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import { PhoneFormatModule } from '@shared/pipes/phone-format.pipe';

@Component({
  selector: 'app-phone-modal',
  templateUrl: './phone-modal.component.html',
  styleUrls: ['./phone-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneModalComponent {
  constructor(private _config: DynamicDialogConfig) {}

  public get phone() {
    return this._config.data.phone;
  }
}

@NgModule({
  declarations: [PhoneModalComponent],
  imports: [DividerModule, PhoneFormatModule],
  exports: [PhoneModalComponent],
})
export class PhoneModalModule {}
