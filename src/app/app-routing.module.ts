import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerComponent } from './scheduler/scheduler.component';

const routes: Routes = [
  { path: 'simulator', component: SchedulerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
