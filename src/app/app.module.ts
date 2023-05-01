import { LOCALE_ID, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogService } from 'primeng/dynamicdialog';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnnouncementHeadingModule } from '@shared/components/announcement-heading/announcement-heading.component';
import { HeaderModule } from '@shared/components/header/header.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AuthInterceptorService } from '@services/auth-interceptor.service';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import { AngularYandexMapsModule, YaConfig } from "angular8-yandex-maps";

registerLocaleData(localeRu);

const mapConfig: YaConfig = {
  apikey: environment.yandexMapsApiKey,
  lang: 'ru_RU',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AnnouncementHeadingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularYandexMapsModule.forRoot(mapConfig),
    AppRoutingModule,
    HeaderModule,
  ],
  providers: [
    DialogService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: LOCALE_ID,
      useValue: 'ru',
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
