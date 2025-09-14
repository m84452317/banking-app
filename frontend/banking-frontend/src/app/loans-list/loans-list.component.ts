import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Loan } from '../models/loan';

@Component({
  selector: 'app-loans-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 class="text-2xl font-semibold mb-4">Current Loans</h2>
      <div *ngIf="loans.length > 0; else noLoans">
        <div *ngFor="let loan of loans" class="bg-white shadow rounded-lg p-4 mb-4" [ngClass]="{
          'bg-green-200 text-green-800': loan.status === 'approved' || loan.status === 'active',
          'bg-red-200 text-red-800': loan.status === 'rejected' || loan.status === 'closed',
          'bg-yellow-200 text-yellow-800': loan.status === 'pending'
        }">
          <h3 class="text-lg font-bold">Loan #{{ loan._id }}</h3>
          <p class="text-gray-600">Type: {{ loan.loanType | titlecase }}</p>
          <p class="text-gray-600">Principal: $ {{ loan.amount | number:'1.2-2' }}</p>
          <p class="text-gray-600">Interest Rate: {{ loan.interestRate }}%</p>
          <p class="text-gray-600">Term: {{ loan.tenureMonths }} months</p>
          <p class="text-gray-600">Status: <span class="font-semibold">{{ loan.status | titlecase }}</span></p>
        </div>
      </div>
      <ng-template #noLoans>
        <p class="text-center text-gray-500">You have no loans.</p>
      </ng-template>
    </div>
  `,
  styles: []
})
export class LoansListComponent {
  @Input() loans: Loan[] = [];
}