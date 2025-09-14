import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { AccountsService } from '../../../services/account.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-100 p-6 rounded-lg shadow-lg mb-6">
      <h2 class="text-xl font-semibold mb-4 text-center">Create a New Account</h2>
      <form (ngSubmit)="onCreateAccount()">
        <div class="flex items-center space-x-4">
          <select [(ngModel)]="accountType" name="accountType" class="flex-grow p-2 border rounded-lg">
            <option value="savings">Savings Account</option>
            <option value="current">Current Account</option>
          </select>
          <button type="submit" [disabled]="loading" class="px-6 py-2 rounded-lg text-white font-semibold"
                  [ngClass]="{'bg-blue-600 hover:bg-blue-700': !loading, 'bg-gray-400 cursor-not-allowed': loading}">
            {{ loading ? 'Creating...' : 'Create' }}
          </button>
        </div>
        <p *ngIf="error" class="text-red-500 mt-2 text-sm text-center">{{ error }}</p>
        <p *ngIf="success" class="text-green-500 mt-2 text-sm text-center">{{ success }}</p>
      </form>
    </div>
  `
})
export class CreateAccountComponent {
  private accountsService = inject(AccountsService);
  @Output() accountCreated = new EventEmitter<void>();

  accountType: 'savings' | 'current' = 'savings';
  loading = false;
  error: string | null = null;
  success: string | null = null;

  onCreateAccount(): void {
    this.loading = true;
    this.error = null;
    this.success = null;
    this.accountsService.createAccount(this.accountType)
      .pipe(
        finalize(() => this.loading = false),
        catchError(err => {
          this.error = `Failed to create account: ${err.error.error || err.message}`;
          return of(null);
        })
      )
      .subscribe(account => {
        if (account) {
          this.success = `Account ${account.accountNumber.substring(0, 8)}... created successfully!`;
          this.accountCreated.emit();
        }
      });
  }
}