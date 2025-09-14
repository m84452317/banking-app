import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { Loan } from '../models/loan';
import { LoanService } from '../services/loans.service';

@Component({
  selector: 'app-repay-loan-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-100 p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold mb-4">Repay Loan</h2>
      <form (ngSubmit)="onRepay()">
        <div class="mb-4">
          <label for="loan" class="block text-gray-700 font-semibold mb-2">Select Loan</label>
          <select
            id="loan"
            [(ngModel)]="selectedLoanId"
            name="selectedLoanId"
            required
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          >
            <option [value]="null" disabled>-- Select a loan --</option>
            <ng-container *ngIf="activeLoans.length > 0; else noActiveLoans">
              <option *ngFor="let loan of activeLoans" [value]="loan._id">
                {{ loan.loanType | titlecase }} Loan (Principal: $ {{ loan.amount | number:'1.2-2' }})
              </option>
            </ng-container>
            <ng-template #noActiveLoans>
              <option disabled>No active loans to repay.</option>
            </ng-template>
          </select>
        </div>
        <div class="mb-4">
          <label for="amount" class="block text-gray-700 font-semibold mb-2">Repayment Amount</label>
          <input
            type="number"
            id="amount"
            [(ngModel)]="repaymentAmount"
            name="repaymentAmount"
            required
            min="0.01"
            class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        >
          Repay
        </button>
      </form>
    </div>
  `,
  styles: []
})
export class RepayLoanFormComponent implements OnInit {
  @Input() loans: Loan[] = [];
  @Output() repaymentCompleted = new EventEmitter<void>();
  selectedLoanId: string | null = null;
  repaymentAmount!: number;
  activeLoans: Loan[] = [];

  private loanService = inject(LoanService);

  ngOnInit(): void {
    this.filterActiveLoans();
  }

  ngOnChanges(): void {
    this.filterActiveLoans();
  }

  filterActiveLoans(): void {
    this.activeLoans = this.loans.filter(loan => loan.status === 'active' || loan.status === 'approved');
  }

  onRepay(): void {
    if (this.selectedLoanId && this.repaymentAmount) {
      this.loanService.repayLoan(this.selectedLoanId, this.repaymentAmount).subscribe({
        next: () => {
          this.repaymentCompleted.emit();
          this.selectedLoanId = null;
          this.repaymentAmount = 0;
        },
        error: (err) => {
          console.error('Repayment failed:', err);
        }
      });
    }
  }
}