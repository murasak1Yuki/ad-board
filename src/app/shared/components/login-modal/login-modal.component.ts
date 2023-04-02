import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss'],
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
