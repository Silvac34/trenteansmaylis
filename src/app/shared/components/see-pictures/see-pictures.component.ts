import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { faDownload, faShare, faCaretLeft, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { Picture } from '../../interfaces/picture';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-see-pictures',
  templateUrl: './see-pictures.component.html',
  styleUrls: ['./see-pictures.component.scss']
})
export class SeePicturesComponent implements OnInit {
  @Input() pictures!: Picture[];
  @Input() index!: number;
  faCaretLeft = faCaretLeft; faDownload = faDownload; faShare = faShare; faTrashAlt = faTrashAlt;
  currentSlideId!: number;
  constructor(
    public activeModal: NgbActiveModal,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private spinnerService: NgxSpinnerService,
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentSlideId = this.index;
  }

  delete() {
    if ((this.auth.userDetail.uid === this.pictures[this.currentSlideId].uploadedByUserId) || (this.auth.userDetail ? this.auth.userDetail.admin : false)) {
      this.spinnerService.show();
      this.storage.storage.refFromURL(this.pictures[this.currentSlideId].downloadURL).delete();
      this.afs.doc<Picture>(`pictures/${this.pictures[this.currentSlideId].pid}`).delete().then(() => {
        this.spinnerService.hide();
        this.activeModal.close('photo deleted');
      })
        .catch(error => {
          console.error(error);
        });
    }
  }


  download(picture: Picture) {
    // je peux télécharger si je suis auteur de la photo ou admin
    if ((this.auth.userDetail.uid === picture.uploadedByUserId) || (this.auth.userDetail ? this.auth.userDetail.admin : false)) {
      const date = picture.pictureDate.toDate();
      const pad = (n: number) => { return n < 10 ? '0' + n : n; };
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.open('GET', picture.downloadURL);
      xhr.onload = (event) => {
        const blob = xhr.response;
        // What to do with the blob
        const a = document.createElement('a');
        a.setAttribute('style', 'display: none');
        document.body.appendChild(a);
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = date.getFullYear() + pad(date.getMonth()) + pad(date.getDate()) + ' - 30ansMaylis.png';
        a.click();
        window.URL.revokeObjectURL(url);
      };
      xhr.send();
    }
  }

  onSlide(event: any) {
    this.currentSlideId = event.current;
  }
}
