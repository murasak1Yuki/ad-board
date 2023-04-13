import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  menuItems!: MenuItem[];
  isAuthenticated: boolean = false;
  private _ref!: DynamicDialogRef;

  constructor(
    private _dialogService: DialogService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Мои объявления',
      },
      {
        label: 'Настройки',
      },
      {
        label: 'Выйти',
        command: () => (this.isAuthenticated = false),
      },
    ];
  }

  showAuthDialog() {
    this._ref = this._dialogService.open(LoginModalComponent, {
      dismissableMask: true,
      width: '100%',
      style: {
        'max-width': '400px',
      },
    });

    this._ref.onClose.subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
      this._cdr.markForCheck();
    });
  }
}

@NgModule({
  declarations: [HeaderComponent],
  imports: [MenuModule, ButtonModule, NgIf],
  exports: [HeaderComponent],
})
export class HeaderModule {}
