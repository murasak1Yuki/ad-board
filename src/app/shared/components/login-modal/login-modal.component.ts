import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent implements OnInit {
  authForm!: FormGroup;
  loginMode: boolean = true;

  constructor(
    private _config: DynamicDialogConfig,
    private _dialogRef: DynamicDialogRef
  ) {
    _config.header = 'Авторизация';
  }

  onSubmit() {
    this._dialogRef.close(true);
  }

  switchMode() {
    this.loginMode = !this.loginMode;
    this._config.header = this.loginMode ? 'Авторизация' : 'Регистрация';
    this.initForm();
  }

  initForm() {
    if (this.loginMode) {
      this.authForm = new FormGroup({
        phone: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
      });
    } else {
      this.authForm = new FormGroup({
        phone: new FormControl('', Validators.required),
        password: new FormControl('', Validators.required),
        passwordConfirmation: new FormControl('', Validators.required),
      });
    }
  }

  ngOnInit() {
    this.initForm();
  }
}

@NgModule({
  declarations: [LoginModalComponent],
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, NgIf],
  exports: [LoginModalComponent],
})
export class LoginModalModule {}
