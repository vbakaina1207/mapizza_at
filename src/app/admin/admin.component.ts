import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../shared/services/account/account.service';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  constructor(
    public router: Router,
    public accountService: AccountService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    
  }

  logout(): void {
    this.router.navigate(['/']);
    localStorage.removeItem('currentUser');
    this.accountService.isUserLogin$.next(true);
  }

  

}

