import { NgModule,ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MyErrorHandler} from './Helpers/MyErrorHandler';
import { AppComponent } from './app.component';
import { MainComponent } from './Components/main.component';
import { MaterialModule } from './material.module';
import { DragDropDirective } from './Directives/drag-drop.directive';
import { PdfViewerModule } from 'ng2-pdf-viewer';

@NgModule({
  declarations: [AppComponent, MainComponent, DragDropDirective],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, MaterialModule,PdfViewerModule],
   providers: [
        {provide: ErrorHandler, useClass: MyErrorHandler}
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
