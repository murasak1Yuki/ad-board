import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
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

  ngOnInit() {
    this._initForm();
  }

  onSubmit() {
    this._dialogRef.close(true);
  }

  switchMode() {
    this.loginMode = !this.loginMode;
    this._config.header = this.loginMode ? 'Авторизация' : 'Регистрация';
    this._initForm();
  }

  private _initForm() {
    if (this.loginMode) {
      this.authForm = new FormGroup({
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
      });
    } else {
      this.authForm = new FormGroup(
        {
          email: new FormControl(null, [Validators.required, Validators.email]),
          password: new FormControl(null, [
            Validators.required,
            Validators.minLength(6),
          ]),
          passwordConfirmation: new FormControl(null, [Validators.required]),
        },
        {
          validators: [this._passwordsMatchValidator],
        }
      );
    }
  }

  private _passwordsMatchValidator(
    form: AbstractControl
  ): ValidationErrors | null {
    const { password, passwordConfirmation } = form.value;
    const passwordConfirmationControl = form.get('passwordConfirmation');

    const errors =
      password === passwordConfirmation || (!password && !passwordConfirmation)
        ? null
        : { passwordMismatch: true };

    passwordConfirmationControl?.setErrors(errors);

    return errors;
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
