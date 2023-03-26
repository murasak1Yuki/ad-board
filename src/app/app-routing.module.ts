import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementHomeComponent } from './pages/announcement-home/announcement-home.component';

const routes: Routes = [
  { path: '', redirectTo: '/announcement-home', pathMatch: 'full' },
  { path: 'announcement-home', component: AnnouncementHomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
