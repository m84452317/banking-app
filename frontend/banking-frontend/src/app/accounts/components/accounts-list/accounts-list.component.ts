import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Account } from '../../models/account';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-2xl font-semibold mb-4 text-center">Account Summary</h2>
      <ng-container *ngIf="accounts && accounts.length > 0; else noAccounts">
        <ul class="space-y-4">
          <li *ngFor="let account of accounts" class="border-b pb-4 last:border-b-0">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-bold text-lg">
                  {{ account.type | titlecase }} Account
                  <span class="text-sm text-gray-500 block">({{ account.accountNumber | slice:0:8 }}...)</span>
                </p>
                <p class="text-green-600 text-xl mt-1 font-mono">
                  $ {{ account.balance | number:'1.2-2' }}
                </p>
              </div>
              <div class="text-right">
                <span class="text-xs font-semibold px-2 py-1 rounded-full"
                      [ngClass]="{'bg-green-200 text-green-800': account.status === 'active', 'bg-red-200 text-red-800': account.status !== 'active'}">
                  {{ account.status | titlecase }}
                </span>
                <p class="text-xs text-gray-400 mt-1">ID: {{ account._id | slice:0:8 }}...</p>
              </div>
            </div>
          </li>
        </ul>
      </ng-container>
      <ng-template #noAccounts>
        <p class="text-center text-gray-500 italic">No accounts found. Create one to get started!</p>
      </ng-template>
    </div>
  `
})
export class AccountsListComponent {
  @Input() accounts: Account[] | null = [];
}