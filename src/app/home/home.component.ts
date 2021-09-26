import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, Observable, Subject, Subscription } from 'rxjs';
import { SeePicturesComponent } from '../shared/components/see-pictures/see-pictures.component';
import { Picture } from '../shared/interfaces/picture';
import { take, map, takeUntil } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  pictures!: Observable<Picture[]>;
  limitNbDisplayedPicture = environment.production ? 20 : 5;
  public seeMorePictures = true;
  // lastPictureDoc est la dernière revie de la liste de review en cours de visibilité
  public lastPictureDoc: any;
  destroy$: Subject<boolean> = new Subject<boolean>();
  subscriptionPicture!: Subscription;
  private snapPictureSubscription!: Subscription;

  constructor(
    private afs: AngularFirestore,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const picturesCol: AngularFirestoreCollection<Picture> = this.afs.collection<Picture>('pictures', ref => ref.orderBy('creationTime', 'desc').limit(this.limitNbDisplayedPicture));
    this.pictures = picturesCol.valueChanges({ idField: 'pid' });
    this.subscriptionPicture = this.pictures.subscribe((arr: Picture[]) => {
      this.seeMorePictures = !(arr.length < this.limitNbDisplayedPicture);
    })
    this.snapPictureSubscription = picturesCol.snapshotChanges().subscribe(snaps => {
      this.lastPictureDoc = snaps.length > 0 ? snaps.pop()?.payload.doc : null;
    });
  }

  openFullScreen(pictures: Picture[], index: number) {
    const modalFullScreen = this.modalService.open(SeePicturesComponent, { size: 'lg', centered: true, keyboard: true });
    modalFullScreen.componentInstance.index = index;
    modalFullScreen.componentInstance.pictures = pictures;
  }


  getMorePictures() {
    let newPicturesRef;
    newPicturesRef = !this.lastPictureDoc ? this.afs.collection<Picture>('pictures', ref => ref
      .orderBy('creationTime', 'desc')
      .limit(this.limitNbDisplayedPicture)) : this.afs.collection<Picture>('pictures', ref => ref
        .orderBy('creationTime', 'desc')
        .startAfter(this.lastPictureDoc)
        .limit(this.limitNbDisplayedPicture));
    this.updateLastDoc(newPicturesRef);
    const newPictures = newPicturesRef.valueChanges();
    this.pictures = combineLatest([this.pictures, newPictures]).pipe(map((arr: [Picture[], Picture[]]) => {
      if (arr[1].length < this.limitNbDisplayedPicture) { this.seeMorePictures = false; }
      return arr[0].concat(arr[1]);
    }),
      takeUntil(this.destroy$));
  }

  updateLastDoc(ref: any) {
    ref.snapshotChanges().pipe(take(1)).subscribe((el: any) => {
      if (el.length > 0) {
        this.lastPictureDoc = el[el.length - 1].payload.doc;
      }
    });
  }


  ngOnDestroy() {
    this.subscriptionPicture.unsubscribe();
    this.snapPictureSubscription.unsubscribe();
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
