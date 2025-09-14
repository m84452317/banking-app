import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepayLoanFormComponent } from './repay-loan-form.component';

describe('RepayLoanFormComponent', () => {
  let component: RepayLoanFormComponent;
  let fixture: ComponentFixture<RepayLoanFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepayLoanFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepayLoanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
