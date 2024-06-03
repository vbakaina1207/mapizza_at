import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVacancyComponent } from './admin-vacancy.component';

describe('AdminVacancyComponent', () => {
  let component: AdminVacancyComponent;
  let fixture: ComponentFixture<AdminVacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminVacancyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminVacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
