import {HttpClientModule} from "@angular/common/http";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AnnouncementHeadingComponent } from './components/announcement-heading/announcement-heading.component';
import { AnnouncementHomeComponent } from './pages/announcement-home/announcement-home.component';
import { AnnouncementItemComponent } from './components/announcement-item/announcement-item.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AnnouncementHeadingComponent,
    AnnouncementHomeComponent,
    AnnouncementItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
