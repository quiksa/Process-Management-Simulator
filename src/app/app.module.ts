import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProcessComponent } from './process/process.component';
import { UtilsService } from './utils.service';

@NgModule({
  declarations: [
    AppComponent,
    ProcessComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [UtilsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
