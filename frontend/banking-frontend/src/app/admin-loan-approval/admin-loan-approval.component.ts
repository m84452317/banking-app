import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Loan } from '../models/loan';
import { LoanService } from '../services/loans.service';

@Component({
  selector: 'app-admin-loan-approval',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  template: `
    <div class="container mx-auto p-4">
      <h2 class="text-3xl font-bold mb-6 text-center">Admin Loan Approval</h2>
      <div *ngIf="pendingLoans$ | async as pendingLoans">
        <div *ngIf="pendingLoans.length > 0; else noPendingLoans">
          <div *ngFor="let loan of pendingLoans" class="bg-white shadow rounded-lg p-6 mb-4">
            <h3 class="text-xl font-semibold mb-2">Loan Application #{{ loan._id }}</h3>
            <p class="text-gray-600">User ID: {{ loan.userId }}</p>
            <p class="text-gray-600">Loan Type: {{ loan.loanType | titlecase }}</p>
            <p class="text-gray-600">Principal: $ {{ loan.amount | number:'1.2-2' }}</p>
            <p class="text-gray-600">Interest Rate: {{ loan.interestRate }}%</p>
            <p class="text-gray-600">Term: {{ loan.tenureMonths }} months</p>
            <p class="text-gray-600">Status: <span class="font-semibold text-orange-500">{{ loan.status | titlecase }}</span></p>
            <div class="mt-4">
              <button
                (click)="approveLoan(loan._id)"
                class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Approve Loan
              </button>
            </div>
          </div>
        </div>
        <ng-template #noPendingLoans>
          <p class="text-center text-gray-500">No pending loans for approval.</p>
        </ng-template>
      </div>
    </div>
  `,
  styles: []
})
export class AdminLoanApprovalComponent implements OnInit {
  private loanService = inject(LoanService);
  pendingLoans$!: Observable<Loan[]>;

ngOnInit(): void {
  alert('ng on init admin loan approval component')
  this.pendingLoans$ = this.loanService.getPendingLoans();
}

  approveLoan(loanId: string): void {
    this.loanService.approveLoan(loanId).subscribe({
      next: () => {
        // Refresh the list of loans
        this.ngOnInit();
      },
      error: (err) => {
        console.error('Failed to approve loan', err);
      }
    });
  }
}