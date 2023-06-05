import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { YaApiLoaderService } from 'angular8-yandex-maps';
import { AuthService } from '@services/auth.service';
import { isEqual } from 'lodash';
import { UserInfoModel } from '@models/user-info.model';
import { CustomValidators } from '../../core/custom-validators';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsComponent implements OnInit {
  public userInfoForm!: FormGroup;
  public newPasswordForm!: FormGroup;
  public isUserInfoChanged: boolean = false;
  public error: string | null = null;
  public isUserInfoSaved: boolean = false;
  public signUpPasswordInputType: string = 'password';
  public showPassword: boolean = false;
  private _lastSavedFormValue: unknown = null;

  constructor(
    private _yaApiLoaderService: YaApiLoaderService,
    private _authService: AuthService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._yaApiLoaderService.load().subscribe((ymaps) => {
      const suggestView = new ymaps.SuggestView('location');
      suggestView.events.add('select', (event) => {
        const address = event.get('item').value;
        this.userInfoForm.get('location')?.setValue(address);
      });
    });
    this._initUserInfoSettings();
    this._initNewPasswordForm();
  }

  onUserInfoSubmit() {
    const { name, phone, location } = this.userInfoForm.value;
    const userInfoId = this._authService.user.value?.userInfo.userInfoId!;
    const updatedUserInfo: UserInfoModel = {
      userId: this._authService.user.value?.id!,
      name: name,
      phone: phone,
      location: location,
    };
    this._authService.updateUserInfo(userInfoId, updatedUserInfo).subscribe({
      next: () => {
        this.isUserInfoSaved = true;
        this._lastSavedFormValue = this.userInfoForm.getRawValue();
        this.isUserInfoChanged = false;
        this._cdr.markForCheck();
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this._cdr.markForCheck();
      },
    });
  }

  onPasswordChange() {
    if (this.newPasswordForm.invalid) {
      return;
    }
    this.newPasswordForm.disable();
    const password = this.newPasswordForm.value.password;
    this._authService.changePassword(password).subscribe({
      next: () => {
        this.newPasswordForm.reset();
        this.newPasswordForm.enable();
        this._cdr.markForCheck();
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.newPasswordForm.reset();
        this.newPasswordForm.enable();
        this._cdr.markForCheck();
      },
    });
  }

  onShowPassword() {
    this.signUpPasswordInputType =
      this.signUpPasswordInputType === 'password' ? 'text' : 'password';
    this.showPassword = !this.showPassword;
  }

  private _initNewPasswordForm() {
    this.newPasswordForm = new FormGroup(
      {
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(6),
        ]),
        passwordConfirmation: new FormControl(null, [Validators.required]),
      },
      [CustomValidators.passwordsMatchValidator]
    );
    this.newPasswordForm.valueChanges.subscribe(() => {
      if (this.error) {
        this.error = null;
        this._cdr.markForCheck();
      }
    });
  }

  private _initUserInfoSettings() {
    this.userInfoForm = new FormGroup({
      name: new FormControl<string | null>(null, [
        Validators.minLength(3),
        Validators.maxLength(24),
      ]),
      phone: new FormControl<string | null>(null),
      location: new FormControl<string | null>(null, [
        Validators.minLength(4),
        Validators.maxLength(50),
      ]),
    });
    this.userInfoForm.disable();
    this._authService.getUsersInfo().subscribe((usersInfo) => {
      const currentUserInfo = usersInfo.find((userInfo) => {
        return userInfo.userId === this._authService.user.value?.id;
      })!;
      if (currentUserInfo) {
        this.userInfoForm.setValue({
          name: currentUserInfo.name,
          phone: currentUserInfo.phone,
          location: currentUserInfo.location,
        });
        this._lastSavedFormValue = this.userInfoForm.getRawValue();
      }
      this.userInfoForm.valueChanges.subscribe(() => {
        this.isUserInfoSaved = false;
        const currentFormValue = this.userInfoForm.getRawValue();
        this.isUserInfoChanged = !isEqual(
          this._lastSavedFormValue,
          currentFormValue
        );
      });
      this.userInfoForm.enable();
      this._cdr.markForCheck();
    });
  }
}
