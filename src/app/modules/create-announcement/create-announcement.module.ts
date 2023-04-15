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

@NgModule({
  declarations: [CreateAnnouncementComponent],
  imports: [
    RouterModule.forChild([
      { path: '', component: CreateAnnouncementComponent },
    ]),
    ReactiveFormsModule,
    TooltipModule,
    TreeSelectModule,
    InputTextModule,
    InputTextareaModule,
    FileUploadModule,
    ToolbarModule,
    InputNumberModule,
  ],
})
export class CreateAnnouncementModule {}
