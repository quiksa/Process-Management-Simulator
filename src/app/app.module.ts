import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ChartjsModule } from '@ctrl/ngx-chartjs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { UtilsService } from './utils.service';
import { FcfsComponent } from './fcfs/fcfs.component';
import { SjfComponent } from './sjf/sjf.component';
import { RrComponent } from './rr/rr.component';

@NgModule({
  declarations: [
    AppComponent,
    SchedulerComponent,
    FcfsComponent,
    SjfComponent,
    RrComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ChartjsModule,
    AppRoutingModule
  ],
  providers: [UtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
