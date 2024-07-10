import { Component, OnInit } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AccountService } from '../../shared/services/account/account.service';
import { ROLE } from '../../shared/constants/role.constant';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.scss']
})
export class AuthDialogComponent implements OnInit {

  public authForm!: FormGroup;
  public regForm!: FormGroup;
  public isLogin = false;
  public isRegister = false;
  public checkPassword = false;
  public credential!: any;
  public currentUser!: any;
  public loginSubscription!: Subscription;
  
  constructor(
    private auth: Auth,
    private afs: Firestore,
    private router: Router,
    private accountService: AccountService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { 
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
    this.regForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      firstName:[null, [Validators.required]],
      lastName: [null, [Validators.required]],
      birthday: [null],
      phoneNumber: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  }

  ngOnInit() {
    this.initAuthForm;
    this.initRegForm;
  }

  initAuthForm(): void {
    this.authForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    })
  }

  initRegForm(): void {
    this.regForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      firstName:[null, [Validators.required]],
      lastName: [null, [Validators.required]],
      birthday: [null],
      phoneNumber: [null, [Validators.required]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]]
    })
  }

  loginUser(): void {
    const { email, password } = this.authForm.value;
    console.log(this.authForm.value);
    this.login(email, password).then(() => {
      this.toastr.success('You have successfully logged in!');
    }).catch(e => {
      this.toastr.error(e.message);
    })
  }

  async login(email: string, password: string): Promise<any> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    console.log('credential', credential);
    this.loginSubscription = docData(doc(this.afs, 'users', credential.user.uid)).subscribe({
      next : (user: any) => {
      this.currentUser = { ...user, uid: credential.user.uid };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));    
      localStorage.setItem('favorite', JSON.stringify(this.currentUser.favorite));          
      if(user && user['role'] === ROLE.USER) {
        //this.router.navigate(['/cabinet']);
        console.log('role', user['role']);
      } else if(user && user['role'] === ROLE.ADMIN){
        this.router.navigate(['/admin']);
        console.log('role', user['role']);
      }
      this.accountService.isUserLogin$.next(true);
    }, 
    error: (e: any)  => {
      console.log('error', e);
    }})
  }

  registerUser(): void {
    const { email, password } = this.regForm.value;
    this.emailSignUp(email, password).then(() => {
      this.toastr.success('Registration was successful!');
      this.isLogin = !this.isLogin;
      this.regForm.reset();
      this.login(email, password).then(() => {
        this.toastr.success('You have successfully logged in!');
      }).catch(e => {
        this.toastr.error(e.message);
      })
    }).catch(e => {
      this.toastr.error(e.message);
    });
  }

  async emailSignUp(email: string, password: string): Promise<any> {
    const { firstName, lastName, birthday, phoneNumber } = this.regForm.value;
    this.credential = await createUserWithEmailAndPassword(this.auth, email, password);
    const user = {
      email: this.credential.user.email,
      firstName: firstName,
      lastName: lastName,
      birthday: birthday,
      phoneNumber: phoneNumber,
      address: [],
      favorite: [],
      orders: [],
      role:"USER"
    };
    setDoc(doc(this.afs, 'users', this.credential.user.uid), user);
  }

  changeIsLogin(): void {
    this.isLogin = !this.isLogin;
  }

  openRegisterDialog(): void {
    this.isRegister = true;
  }

  openLoginDialog(): void {
    this.isRegister = false;
  }

  checkConfirmPassword(): void {
    this.checkPassword = this.password.value === this.confirmed.value;
    if(this.password.value !== this.confirmed.value) {
      this.regForm.controls['confirmPassword'].setErrors({
        matchError: 'Password confirmation doesnt match'
      })
    }
  }

  get password(): AbstractControl {
    return this.regForm.controls['password'];
  }

  get confirmed(): AbstractControl {
    return this.regForm.controls['confirmPassword'];
  }

  checkVisibilityError(control: string, name: string): boolean | null {
    return this.regForm.controls[control]?.errors?.[name]
  }


}
