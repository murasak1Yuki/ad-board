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
import { PasswordModule } from 'primeng/password';

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
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
      });
    } else {
      this.authForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        passwordConfirmation: new FormControl(null, [
          Validators.required,
          this.passwordsMatchValidator.bind(this),
        ]),
      });
    }
  }

  ngOnInit() {
    this.initForm();
  }

  private passwordsMatchValidator(
    control: FormControl
  ): { [s: string]: boolean } | null {
    const password = this.authForm.value.password;
    const passwordConfirmation = control.value;
    return password === passwordConfirmation
      ? null
      : { passwordMismatch: true };
  }
}

@NgModule({
  declarations: [LoginModalComponent],
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    NgIf,
    PasswordModule,
  ],
  exports: [LoginModalComponent],
})
export class LoginModalModule {}
