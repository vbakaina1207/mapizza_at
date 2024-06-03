import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyInfoComponent } from './vacancy-info.component';

describe('VacancyInfoComponent', () => {
  let component: VacancyInfoComponent;
  let fixture: ComponentFixture<VacancyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VacancyInfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VacancyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
