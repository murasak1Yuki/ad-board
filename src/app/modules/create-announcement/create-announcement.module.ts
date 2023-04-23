import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CreateAnnouncementComponent } from './create-announcement.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { TreeSelectModule } from 'primeng/treeselect';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { NgClass, NgIf } from '@angular/common';
import { AuthGuard } from '../../core/guards/auth.guard';

@NgModule({
  declarations: [CreateAnnouncementComponent],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: CreateAnnouncementComponent,
        canActivate: [AuthGuard],
      },
    ]),
    ReactiveFormsModule,
    TooltipModule,
    TreeSelectModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ToolbarModule,
    InputNumberModule,
    InputMaskModule,
    NgIf,
    NgClass,
  ],
})
export class CreateAnnouncementModule {}
