import { Injectable } from '@angular/core';
import { Auth, EmailAuthProvider,  signInWithEmailAndPassword } from '@angular/fire/auth';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable, catchError, from, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordValidatorService {

  constructor(private auth: Auth) {}

  // Async validator for checking the current password
  currentPasswordValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      const { value } = control;

      // If the field is empty, consider the password valid
      if (!value) {
        return of(null);
      }

      const { password } = value;
      const credential = EmailAuthProvider.credential(this.auth.currentUser?.email as string, password);

      // Attempt to reauthenticate the user with the current password
      return from(signInWithEmailAndPassword(this.auth, this.auth.currentUser?.email as string, password))
        .pipe(
          catchError(() => of({ invalidPassword: true }))
        );
    };
  }
}


