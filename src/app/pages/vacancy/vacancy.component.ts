import { Component, OnInit } from '@angular/core';
import { IVacancyResponse } from '../../shared/interfaces/vacancy/vacancy.interface';
import { Subscription } from 'rxjs';
import { VacancyService } from '../../shared/services/vacancy/vacancy.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrl: './vacancy.component.scss'
})
export class VacancyComponent implements OnInit {

  public userVacancy: Array<IVacancyResponse> = [];
  public eventSubscription!: Subscription;

  constructor( private vacancyService: VacancyService,
    
    private router: Router
  ) {
    this.eventSubscription = this.router.events.subscribe(event => {
      if(event instanceof NavigationEnd ) {
        this.getVacancy();
      }
    })
  }

  ngOnInit() {
  }

  getVacancy(): void {
    this.vacancyService.getAllFirebase().subscribe(data => {
      this.userVacancy = data as IVacancyResponse[];
    })
  }


  getDescription(str:string):string {    
    return str.replace(/<h2>|<\/h2>|<strong>|<\/strong>/gi, '');  
  } 


  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }
}
