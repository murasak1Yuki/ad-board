import { NgModule } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { AnnouncementHeadingComponent } from './shared/components/announcement-heading/announcement-heading.component';
import { AnnouncementHomeComponent } from './pages/announcement-home/announcement-home.component';
import { AnnouncementItemComponent } from './shared/components/announcement-item/announcement-item.component';
import { LoginModalComponent } from './shared/components/login-modal/login-modal.component';
import { CreateAnnouncementComponent } from './pages/create-announcement/create-announcement.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AnnouncementHeadingComponent,
    AnnouncementHomeComponent,
    AnnouncementItemComponent,
    LoginModalComponent,
    CreateAnnouncementComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgOptimizedImage,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    ButtonModule,
    InputTextModule,
    DynamicDialogModule,
    ProgressSpinnerModule,
    AppRoutingModule,
  ],
  providers: [DialogService],
  bootstrap: [AppComponent],
})
export class AppModule {}
