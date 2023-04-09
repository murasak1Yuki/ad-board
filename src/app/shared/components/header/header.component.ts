import {
  ChangeDetectionStrategy,
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
  ref!: DynamicDialogRef;
  menuItems!: MenuItem[];
  isAuthenticated: boolean = false;

  constructor(private _dialogService: DialogService) {}

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
      },
    ];
  }

  showAuthDialog() {
    this.ref = this._dialogService.open(LoginModalComponent, {
      dismissableMask: true,
      width: '100%',
      style: {
        'max-width': '400px',
      },
    });

    this.ref.onClose.subscribe((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
    });
  }
}

@NgModule({
  declarations: [HeaderComponent],
  imports: [MenuModule, ButtonModule, NgIf],
  exports: [HeaderComponent],
})
export class HeaderModule {}
