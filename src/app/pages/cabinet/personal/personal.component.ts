import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../../shared/services/account/account.service';
import { AuthAddressComponent } from '../../../components/auth-address/auth-address.component';
import { ToastService } from '../../../shared/services/toast/toast.service';


@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss']
})
export class PersonalComponent implements OnInit {

  public authFormData!: FormGroup;
  public currentUser: any;
  public dataUser!: any;
  public index!: number;
  public isEdit!: boolean;
  public user = {};
  public isOpenAddressForm: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private afs: Firestore,
    private auth: Auth,
    private toast: ToastrService,
    public dialog: MatDialog,
    private accountService: AccountService,
    private toastr: ToastService
  ) { }

  ngOnInit() {
    this.loadUser();
    this.getUser();
    this.initAuthFormData();
    this.updateAddress();   
    this.updateCurrentUser();
  }

  initAuthFormData(): void {
      this.authFormData = this.fb.group({
        email: [this.currentUser['email'], [Validators.required, Validators.email]],
        password: [null, [Validators.required]],
        firstName: [this.currentUser['firstName'], [Validators.required]],
        lastName:[this.currentUser['lastName'], [Validators.required]],
        phoneNumber: [this.currentUser['phoneNumber'], [Validators.required]],
        birthday: [this.currentUser['birthday']]
      });
  }

  loadUser(): void {
    if(localStorage.length > 0 && localStorage.getItem('currentUser')){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
      this.accountService.userAddress = this.currentUser['address'];    
      this.dataUser = this.accountService.userAddress;      
      if (this.isOpenAddressForm) {
        this.updateAddress();
    }
    }
  }

  editUser(): void {
    this.authFormData.patchValue({
      email: this.currentUser['email'],
      firstName: this.currentUser['firstName'],
      lastName: this.currentUser['lastName'],
      phoneNumber: this.currentUser['phoneNumber'],
      birthday: this.currentUser['birthday'],
      role: 'USER'
    });
  }

  openAddressDialog(): void {
    this.dialog.open(AuthAddressComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'auth-address-dialog',
      autoFocus: false
    }).afterClosed().subscribe(result => {
      console.log(result);
      this.dataUser = this.accountService.userAddress;      
    })
    this.isOpenAddressForm = true;
    //this.dataUser = this.accountService.userAddress;    
  }

  getUser():void{
    getDoc(doc(this.afs, "users", this.currentUser.uid)).then((user_doc) => {        
        this.authFormData = this.fb.group({
          email: [this.currentUser['email'], [Validators.required, Validators.email]],          
          password: [null, [Validators.required]],
          firstName: [this.currentUser['firstName'], [Validators.required]],
          lastName: [this.currentUser['lastName'], [Validators.required]],
          phoneNumber: [this.currentUser['phoneNumber'], [Validators.required]],
          birthday: [this.currentUser['birthday']]
        });    
        this.dataUser = user_doc.get('address');        
      })
}

  updateUser():void{        
    this.updateDoc().then(() => {
      // this.toastr.success('User successfully changed');
      this.toastr.showSuccess('', 'User data successfully changed');
      console.log('User update');
    }).catch(e => {
      this.toast.error(e.message);
    });
    
  }

  selectDataUser(): void {
    const { email, firstName, lastName, phoneNumber, birthday } = this.authFormData.value;
    this.user = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      birthday: birthday,
      address: this.dataUser,
      role: 'USER'
    };    
  }

  async updateDoc(): Promise<any> {
    this.selectDataUser();
    const user = this.user;
    setDoc(doc(this.afs, 'users', this.currentUser.uid), user, { merge: true });
    localStorage.setItem('currentUser', JSON.stringify( user));
  }

  updateCurrentUser(): void {
    this.accountService.changeCurrentUser.subscribe(() => {
      this.loadUser();
    })
  }

  


  

  updateAddress(): void {
    this.accountService.changeAddress.subscribe(() => {
      this.dataUser = this.accountService.userAddress;
    })
  }


  editAddress( i: number): void {
    getDoc(doc(this.afs, "users", this.currentUser.uid)).then((user_doc) => {
      this.dataUser = user_doc.get('address');
    });
    this.accountService.index = i;
    this.isEdit = true;
    this.accountService.isEdit = this.isEdit;
    this.openAddressDialog();
    }
 
  deleteAddress(i: number): void {
    this.dataUser.splice(i, 1);
    this.accountService.userAddress = this.dataUser;
  }
}
