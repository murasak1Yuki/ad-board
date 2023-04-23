import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule, OnDestroy,
  OnInit,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthService } from '@services/auth.service';
import { AuthResponseData } from '@models/auth-response-data.model';
import { Subscription } from 'rxjs';
import {User} from "@models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuItems!: MenuItem[];
  isAuthenticated: boolean = false;
  user!: User | null;
  private _ref!: DynamicDialogRef;
  private _userSub!: Subscription;

  constructor(
    private _dialogService: DialogService,
    private _cdr: ChangeDetectorRef,
    private _authService: AuthService
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
        command: () => this._authService.logout(),
      },
    ];
    this._userSub = this._authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      this.user = user;
    });
  }

  ngOnDestroy() {
    this._userSub.unsubscribe();
  }

  showAuthDialog() {
    this._ref = this._dialogService.open(LoginModalComponent, {
      dismissableMask: true,
      width: '100%',
      style: {
        'max-width': '400px',
      },
    });

    this._ref.onClose.subscribe((authResponseData: AuthResponseData) => {
      this.isAuthenticated = !!authResponseData;
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
