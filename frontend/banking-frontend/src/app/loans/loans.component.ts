import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, finalize, of } from 'rxjs';
import { ApplyLoanFormComponent } from '../apply-loan-form/apply-loan-form.component';
import { LoansListComponent } from '../loans-list/loans-list.component';
import { Loan } from '../models/loan';
import { RepayLoanFormComponent } from '../repay-loan-form/repay-loan-form.component';
import { LoanService } from '../services/loans.service';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [
    CommonModule,
    LoansListComponent,
    ApplyLoanFormComponent,
    RepayLoanFormComponent
  ],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-center">Your Loans</h1>
      <app-apply-loan-form (loanApplied)="loadLoans()"></app-apply-loan-form>
      <ng-container *ngIf="loading; else loadedContent">
        <p class="text-center text-gray-500">Loading loans...</p>
      </ng-container>
      <ng-template #loadedContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-1">
            <app-loans-list [loans]="loans"></app-loans-list>
          </div>
          <div class="md:col-span-1">
            <app-repay-loan-form [loans]="loans" (repaymentCompleted)="loadLoans()"></app-repay-loan-form>
          </div>
        </div>
      </ng-template>
      <div *ngIf="error" class="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
        Error: {{ error }}
      </div>
    </div>
  `,
  styles: []
})
export class LoansComponent implements OnInit {
  private loanService = inject(LoanService);
  loans: Loan[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    this.loading = true;
    this.loanService.getLoans()
      .pipe(
        catchError(err => {
          this.error = err.error?.error || 'Failed to fetch loans.';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(loans => {
        this.loans = loans;
      });
  }
}