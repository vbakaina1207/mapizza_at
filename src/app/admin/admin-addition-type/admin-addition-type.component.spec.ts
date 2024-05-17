import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAdditionTypeComponent } from './admin-addition-type.component';

describe('AdminAdditionTypeComponent', () => {
  let component: AdminAdditionTypeComponent;
  let fixture: ComponentFixture<AdminAdditionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAdditionTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminAdditionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
