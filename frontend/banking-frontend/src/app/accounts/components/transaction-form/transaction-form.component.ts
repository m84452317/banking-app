import { Component, Input, inject, Output, EventEmitter } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError, finalize, of } from 'rxjs';
import { Account } from '../../models/account';
import { AccountsService } from '../../../services/account.service';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white shadow-lg rounded-lg p-6 space-y-4">
      <h2 class="text-xl font-semibold text-center">Make a Transaction</h2>
      <form [formGroup]="transactionForm" (ngSubmit)="onSubmit()">
        <div>
          <label for="accountId" class="block text-sm font-medium text-gray-700">Select Account</label>
          <select id="accountId" formControlName="accountId" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="" disabled>-- Choose an account --</option>
            <option *ngFor="let account of accounts" [value]="account._id">
              {{ account.type | titlecase }} Account (Balance: $ {{ account.balance | number:'1.2-2' }})
            </option>
          </select>
        </div>
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700">Transaction Type</label>
          <select id="type" formControlName="type" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="deposit">Deposit</option>
            <option value="withdraw">Withdraw</option>
          </select>
        </div>
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700">Amount</label>
          <input id="amount" type="number" formControlName="amount" class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
        </div>
        <button type="submit" [disabled]="transactionForm.invalid || loading" class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {{ loading ? 'Processing...' : 'Submit Transaction' }}
        </button>
      </form>
      <div *ngIf="error" class="text-red-500 text-sm mt-2 text-center">{{ error }}</div>
    </div>
  `,
})
export class TransactionFormComponent {
  @Input() accounts: Account[] | null = [];
  @Output() transactionCompleted = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private accountsService = inject(AccountsService);
  loading = false;
  error: string | null = null;

  transactionForm = this.fb.group({
    accountId: ['', Validators.required],
    type: ['deposit', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]]
  });

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      return;
    }
    this.loading = true;
    this.error = null;
    const { accountId, type, amount } = this.transactionForm.value;

    const transaction$ = type === 'deposit'
      ? this.accountsService.deposit(accountId!, amount!)
      : this.accountsService.withdraw(accountId!, amount!);

    transaction$.pipe(
      finalize(() => this.loading = false),
      catchError(err => {
        this.error = err.error?.error || 'Transaction failed.';
        return of(null);
      })
    ).subscribe(result => {
      if (result) {
        this.transactionCompleted.emit();
        this.transactionForm.reset({ accountId, type, amount: 0 });
      }
    });
  }
}