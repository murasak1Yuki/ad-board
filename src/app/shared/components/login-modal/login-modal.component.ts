import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { Observable } from 'rxjs';
import { AuthService } from '@services/auth.service';
import { AuthResponseData } from '@models/auth-response-data.model';
import { UserInfoModel } from '@models/user-info.model';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginModalComponent implements OnInit {
  authForm!: FormGroup;
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  signUpPasswordInputType: string = 'password';
  showPassword: boolean = false;
  error: string | null = null;

  constructor(
    private _config: DynamicDialogConfig,
    private _authService: AuthService,
    private _dialogRef: DynamicDialogRef,
    private _cdr: ChangeDetectorRef
  ) {
    _config.header = 'Авторизация';
  }

  onShowPassword() {
    this.signUpPasswordInputType =
      this.signUpPasswordInputType === 'password' ? 'text' : 'password';
    this.showPassword = !this.showPassword;
  }

  ngOnInit() {
    this._initForm();
    this._handleError();
  }

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }
    const email = this.authForm.value.email;
    const password = this.authForm.value.password;

    let authObs$: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs$ = this._authService.login(email, password);
    } else {
      authObs$ = this._authService.signup(email, password);
    }

    authObs$.subscribe({
      next: (responseData: AuthResponseData) => {
        if (!this.isLoginMode) {
          const userDto: UserInfoModel = {
            userId: responseData.localId,
            name: '',
            phone: '',
            location: '',
          };
          this._authService.storeUserInfo(userDto);
        }
        this.isLoading = false;
        this._dialogRef.close(responseData);
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
        this._cdr.markForCheck();
      },
    });
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this._config.header = this.isLoginMode ? 'Авторизация' : 'Регистрация';
    this._initForm();
    this._handleError();
    this.showPassword = false;
    this.signUpPasswordInputType = 'password';
    this.error = null;
  }

  private _handleError() {
    this.authForm.valueChanges.subscribe((_) => {
      if (this.error) {
        this.error = null;
        this._cdr.markForCheck();
      }
    });
  }

  private _initForm() {
    if (this.isLoginMode) {
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
    let passwordConfirmationControlErrors = passwordConfirmationControl!.errors;

    password === passwordConfirmation || (!password && !passwordConfirmation)
      ? delete passwordConfirmationControlErrors?.['passwordMismatch']
      : (passwordConfirmationControlErrors = {
          ...passwordConfirmationControlErrors,
          passwordMismatch: true,
        });

    passwordConfirmationControl?.setErrors(
      Object.keys(passwordConfirmationControlErrors ?? {}).length
        ? passwordConfirmationControlErrors
        : null
    );

    return null;
  }
}

@NgModule({
  declarations: [LoginModalComponent],
  imports: [ReactiveFormsModule, InputTextModule, ButtonModule, NgIf],
  exports: [LoginModalComponent],
})
export class LoginModalModule {}
