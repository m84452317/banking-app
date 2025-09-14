import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoanApprovalComponent } from './admin-loan-approval.component';

describe('AdminLoanApprovalComponent', () => {
  let component: AdminLoanApprovalComponent;
  let fixture: ComponentFixture<AdminLoanApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoanApprovalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoanApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
