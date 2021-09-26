import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

interface dataforsignup {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface dataforsignin {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userDetail: any;
  authState: any = null;
  private readonly AUTH_TOKEN = 'auth-token';

  constructor(
    private afAuth: AngularFireAuth,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // si l'utilisateur existe dans le stockage du navigateur
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('user') !== 'null' && !!localStorage.getItem('user')) {
      this.userDetail = JSON.parse(localStorage.getItem('user') || 'null');
    }
  }

  // // Email/Password Auth // //
  signup(data: dataforsignup) {
    return this.afAuth.createUserWithEmailAndPassword(data.email, data.password)
      .then(() => {
        return this.afAuth.currentUser
          .then(user => {
            return user?.updateProfile({ displayName: data.firstName + ' ' + data.lastName })
              .then(() => {
                localStorage.setItem('user', JSON.stringify(user));
                this.userDetail = user;
                return 'user signed up';
              })
              .catch(error => {
                console.log(error);
                return error;
              });
          })
          .catch(error => {
            console.log(error);
            return error;
          });
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }

  signin(data: dataforsignin) {
    return this.afAuth.signInWithEmailAndPassword(data.email, data.password)
      .then((res) => {
        this.userDetail = res.user
        localStorage.setItem('user', JSON.stringify(res.user));
        return 'user signed in';
      })
      .catch(error => {
        console.log(error);
        return error;
      });
  }

  signOut() {
    // on supprime redirectUrl de authGuard
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.userDetail = null;
    });
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.AUTH_TOKEN);
    }
    else {
      return null;
    }
  }

  setToken(val: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.AUTH_TOKEN, val);
    }
  }


  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('user') !== 'null') {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return (user !== null) ? true : false;
    }
    else {
      return false
    }

  }
}
