import { Component, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, finalize, of } from 'rxjs';
import { LoanService } from '../services/loans.service';

@Component({
  selector: 'app-apply-loan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
      <h2 class="text-xl font-semibold mb-4 text-center">Apply for a New Loan</h2>
      <form [formGroup]="loanForm" (ngSubmit)="onSubmit()">
        <div class="space-y-4">
          <div>
            <label for="loanType" class="block text-sm font-medium text-gray-700">Loan Type</label>
            <select id="loanType" formControlName="loanType" class="mt-1 block w-full p-2 border rounded-lg">
              <option value="personal">Personal Loan</option>
              <option value="mortgage">Mortgage Loan</option>
              <option value="auto">Auto Loan</option>
            </select>
          </div>
          <div>
            <label for="principalAmount" class="block text-sm font-medium text-gray-700">Principal Amount</label>
            <input id="principalAmount" type="number" formControlName="principalAmount" class="mt-1 block w-full p-2 border rounded-lg">
          </div>
          <div>
            <label for="interestRate" class="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
            <input id="interestRate" type="number" formControlName="interestRate" class="mt-1 block w-full p-2 border rounded-lg">
          </div>
          <div>
            <label for="termMonths" class="block text-sm font-medium text-gray-700">Term (in Months)</label>
            <input id="termMonths" type="number" formControlName="termMonths" class="mt-1 block w-full p-2 border rounded-lg">
          </div>
        </div>
        <button type="submit" [disabled]="loanForm.invalid || loading" class="w-full mt-4 px-6 py-2 rounded-lg text-white font-semibold"
                [ngClass]="{'bg-blue-600 hover:bg-blue-700': !loading, 'bg-gray-400 cursor-not-allowed': loading}">
          {{ loading ? 'Applying...' : 'Apply' }}
        </button>
      </form>
      <p *ngIf="error" class="text-red-500 mt-2 text-sm text-center">{{ error }}</p>
      <p *ngIf="success" class="text-green-500 mt-2 text-sm text-center">{{ success }}</p>
    </div>
  `,
  styles: []
})
export class ApplyLoanFormComponent {
  private fb = inject(FormBuilder);
  private loanService = inject(LoanService);

  @Output() loanApplied = new EventEmitter<void>();

  loading = false;
  error: string | null = null;
  success: string | null = null;

  loanForm = this.fb.group({
    loanType: ['personal', Validators.required],
    principalAmount: [0, [Validators.required, Validators.min(100)]],
    interestRate: [0, [Validators.required, Validators.min(0)]],
    termMonths: [0, [Validators.required, Validators.min(1)]]
  });

  onSubmit(): void {
    if (this.loanForm.invalid) {
      return;
    }
    this.loading = true;
    this.error = null;
    this.success = null;

    this.loanService.applyLoan(this.loanForm.value as any)
      .pipe(
        finalize(() => this.loading = false),
        catchError(err => {
          this.error = `Failed to apply for loan: ${err.error.error || err.message}`;
          return of(null);
        })
      )
      .subscribe(loan => {
        if (loan) {
          this.success = `Loan application submitted successfully with ID: ${loan._id.substring(0, 8)}...`;
          this.loanApplied.emit();
          this.loanForm.reset();
        }
      });
  }
}