import { NgModule } from '@angular/core';

import { SeePicturesComponent } from './see-pictures.component';
import { SharedModule } from '../../shared.module';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [SeePicturesComponent],
  imports: [
    SharedModule,
    NgbCarouselModule
  ],
  exports: [SeePicturesComponent]
})
export class SeePicturesModule { }
