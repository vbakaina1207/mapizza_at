import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProductTypeComponent } from './admin-product-type.component';

describe('AdminProductTypeComponent', () => {
  let component: AdminProductTypeComponent;
  let fixture: ComponentFixture<AdminProductTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductTypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
