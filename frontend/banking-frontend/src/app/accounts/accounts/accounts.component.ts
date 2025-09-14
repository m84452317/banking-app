import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, finalize, of } from 'rxjs';
import { AccountsService } from '../../services/account.service';
import { Account } from '../models/account';
import { CreateAccountComponent } from '../components/create-account/create-account.component';
import { AccountsListComponent } from '../components/accounts-list/accounts-list.component';
import { TransactionFormComponent } from '../components/transaction-form/transaction-form.component';
import { TransferFormComponent } from '../components/transfer-form/transfer-form.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    AccountsListComponent,
    CreateAccountComponent,
    TransactionFormComponent,
    TransferFormComponent
  ],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-center">Your Accounts</h1>
      <app-create-account (accountCreated)="loadAccounts()"></app-create-account>
      <ng-container *ngIf="loading; else loadedContent">
        <p class="text-center text-gray-500">Loading accounts...</p>
      </ng-container>
      <ng-template #loadedContent>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="md:col-span-1">
            <app-accounts-list [accounts]="accounts"></app-accounts-list>
          </div>
          <div class="md:col-span-1">
            <app-transaction-form [accounts]="accounts" (transactionCompleted)="loadAccounts()"></app-transaction-form>
            <app-transfer-form [accounts]="accounts" (transferCompleted)="loadAccounts()"></app-transfer-form>
          </div>
        </div>
      </ng-template>
      <div *ngIf="error" class="mt-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
        Error: {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class AccountsComponent implements OnInit {
  private accountsService = inject(AccountsService);
  accounts: Account[] = [];
  loading = false;
  error: string | null = null;

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountsService.getAccounts()
      .pipe(
        catchError(err => {
          this.error = err.error?.error || 'Failed to fetch accounts.';
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(accounts => {
        this.accounts = accounts;
      });
  }
}