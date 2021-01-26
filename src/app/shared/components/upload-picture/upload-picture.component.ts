import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { faTrashAlt, faEdit, faTimesCircle, faCheck, faUndo, faRedo } from '@fortawesome/free-solid-svg-icons';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'app-upload-picture',
  templateUrl: './upload-picture.component.html',
  styleUrls: ['./upload-picture.component.scss']
})
export class UploadPictureComponent implements OnInit, OnDestroy {
  @Input()
  images!: string[];
  @Input() form: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  submitted = false;
  limitUploadPictureReached = false;
  cropItem!: boolean[];
  croppedImage!: string;
  faTrashAlt = faTrashAlt; faEdit = faEdit; faTimesCircle = faTimesCircle; faCheck = faCheck; faUndo = faUndo; faRedo = faRedo;
  rotation = 0;
  comments!: string[];
  pictureDates!: any[];

  constructor(
    private storage: AngularFireStorage,
    private afs: AngularFirestore,
    public activeModal: NgbActiveModal,
    private spinnerService: NgxSpinnerService,
    public router: Router,
    public auth: AuthService
  ) { }

  ngOnInit(){
    this.cropItem = new Array(this.images.length);
    this.cropItem.forEach(val => val = false);
    this.comments = new Array(this.images.length);
    this.comments.forEach(val => val = '');
    this.pictureDates = new Array(this.images.length);
    this.pictureDates.forEach(val => val = null);
  }

  async uploadPictures(images: string[]) {
    try {
      const promises: AngularFireUploadTask[] = [];
      images.forEach((url: string) => {
        // on génère un id unique pour chaque photo uploadée
        const pictureId = Date.now();
        const filePath = 'pictures/' + this.auth.userDetail.uid + '/' + pictureId + '.png';
        const ref = this.storage.ref(filePath);
        promises.push(ref.putString(url, 'data_url'));
      })
      const tasks = await Promise.all(promises);
      const promises2: any = [];
      tasks.forEach(task => {
        promises2.push(task.ref.getDownloadURL());
      });
      const urls: string[] = await Promise.all(promises2);
      urls.forEach((url: string, index: number) => {
        console.log('picture meal : ' + url);
        // on ajoute dans firestore les infos relatives à la photo
        this.afs.collection('pictures').add({
          uploadedByUserId: this.auth.userDetail.uid,
          uploadedByUserDisplayName: this.auth.userDetail.displayName,
          downloadURL: url,
          creationTime: new Date(),
          comment: this.comments[index],
          pictureDate: this.pictureDates[index]
        });
        if (index === (urls.length - 1)) {
          this.activeModal.close('update success');
          this.router.navigate(['home']);
        }
      });
    }
    catch (err) {
      this.spinnerService.hide();
      console.log('error uploading picture : ' + err);
    }
  }

  switchCrop(index: number) {
    this.cropItem[index] = !this.cropItem[index];
  }

  crop(index: number) {
    this.switchCrop(index);
    if (this.images) { this.images[index] = this.croppedImage; }
  }

  rotate(nb: number) {
    this.rotation += nb;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  delete(index: number): void {
    this.images.splice(index, 1);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }

}
