import { Component, OnInit } from '@angular/core';
import { ImgCompressService } from '../shared/services/img-compress/img-compress.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadPictureComponent } from '../shared/components/upload-picture/upload-picture.component';
import { ToastService } from '../shared/services/toasts/toast.service';
import { AuthService } from '../shared/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {
  public signin = false;
  public signup = false;
  faEye = faEye; faEyeSlash = faEyeSlash;
  public loginForm!: FormGroup;
  public isPasswordVisible = false;
  public errorUserNotFound = false;
  public errorWrongPassword = false;
  public errorNetworkFailed = false;
  public errorAccountExists = false;
  public errorUserAlreadyInUse = false;
  public errorOther = false;

  constructor(
    private imageCompress: ImgCompressService,
    private spinnerService: NgxSpinnerService,
    private modalService: NgbModal,
    private toastService: ToastService,
    public auth: AuthService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    console.log(this.auth.userDetail)
  }

  createSignupForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    })
  }

  createSigninForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  logAction() {
    this.errorUserNotFound = false;
    this.errorWrongPassword = false;
    this.errorNetworkFailed = false;
    this.errorAccountExists = false;
    this.errorOther = false;
    if (this.loginForm.valid) {
      this.spinnerService.show();
      // si la personne se connecte
      if (this.signin) {
        this.auth.signin(this.loginForm.value)
          .then(result => {
            if (result === 'user signed in') {
              this.signin = false;
              this.spinnerService.hide();
            }
            else if (result.code === 'auth/user-not-found') {
              this.errorUserNotFound = true;
              this.spinnerService.hide();
            }
            else if (result.code === 'auth/wrong-password') {
              this.errorWrongPassword = true;
              this.spinnerService.hide();
            }
            else if (result.code === 'auth/account-exists-with-different-credential') {
              this.errorAccountExists = true;
              this.spinnerService.hide();
            }
            else if (result.code === 'auth/network-request-failed') {
              this.errorNetworkFailed = true;
              this.spinnerService.hide();
            }
            else {
              this.errorOther = true;
              this.spinnerService.hide();
            }
          })
      }
      // si la personne se crée un compte
      if (this.signup) {
        this.auth.signup(this.loginForm.value)
          .then(result => {
            if (result === 'user signed up') {
              this.signup = false;
              this.spinnerService.hide();
            }
            else if (result.code === 'auth/email-already-in-use') {
              this.errorUserAlreadyInUse = true;
            }
            else {
              this.errorOther = true;
            }
            this.spinnerService.hide();
          })
      }
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }

  async addMultiplePictures(actualizedTempA: any, actualizedErrA: any) {
      try {
        let { images, orientations } = await this.imageCompress.uploadMultipleFiles();
        this.spinnerService.show();
        // besoin de compresser les images
        if (images.length > 0) {
          images.forEach(async (image: string, index: number) => {
            const byteCount = this.imageCompress.byteCount(image);
            console.warn('Size in bytes was:', byteCount);
            if (this.imageCompress.byteCount(image) > 50000) {
              const imageCompressed = await this.imageCompress.compressFile(image, orientations[index], 50, 50);
              console.warn('Size in bytes is now:', this.imageCompress.byteCount(imageCompressed));
              images[index] = imageCompressed;
            }
          })
          const openingModal = (actualizedTempA: any, actualizedErrA: any) => {
            this.spinnerService.hide();
            const modalUploadPicture = this.modalService.open(UploadPictureComponent, { size: 'lg' });
            modalUploadPicture.componentInstance.images = images;
            modalUploadPicture.result.then((result) => {
              console.log('popup closed : ' + result);
              this.spinnerService.hide();
              this.toastService.show(actualizedTempA, { classname: 'bg-success text-white' });
            }, (reason) => {
              console.log('modal closed with cross click : ' + reason);
              this.spinnerService.hide();
            })
              .catch(err => {
                console.log(err);
                this.spinnerService.hide();
                console.log('error loading modal');
                this.toastService.show(actualizedErrA, { classname: 'bg-danger text-white' });
              });
          };
          openingModal(actualizedTempA, actualizedErrA);
        }
      }
      catch (err) {
        this.toastService.show(actualizedErrA, { classname: 'bg-danger text-white' });
        this.spinnerService.hide();
        console.log(err);
      }
  }

}
