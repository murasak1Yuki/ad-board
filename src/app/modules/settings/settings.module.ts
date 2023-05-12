import { NgModule } from '@angular/core';
import { SettingsComponent } from './settings.component';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: SettingsComponent,
        canActivate: [AuthGuard],
      },
    ]),
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    InputMaskModule,
    ButtonModule,
    NgIf,
  ],
})
export class SettingsModule {}
