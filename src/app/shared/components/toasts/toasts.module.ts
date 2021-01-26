import { NgModule } from '@angular/core';
import { ToastsComponent } from './toasts.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [ToastsComponent],
  imports: [
    CommonModule,
    NgbToastModule
  ],
  exports: [ToastsComponent]
})
export class ToastsModule { }
