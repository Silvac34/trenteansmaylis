import { NgModule } from '@angular/core';
import { FriendsRoutingModule } from './friends-routing.module';
import { FriendsComponent } from './friends.component';
import { SharedModule } from '../shared/shared.module';
import { UploadPictureComponent } from '../shared/components/upload-picture/upload-picture.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [FriendsComponent, UploadPictureComponent],
  imports: [
    SharedModule,
    FriendsRoutingModule,
    AngularFireStorageModule,
    ImageCropperModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FriendsModule { }
