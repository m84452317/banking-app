import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account } from '../accounts/models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4000/api/accounts';

  /** Fetches all accounts for the logged-in user. */
  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(this.apiUrl);
  }

  /** Creates a new account. */
  createAccount(type: 'savings' | 'current'): Observable<Account> {
    return this.http.post<Account>(this.apiUrl, { type });
  }

  /** Processes a deposit for a specific account. */
  deposit(accountId: string, amount: number): Observable<{ message: string; account: Account }> {
    return this.http.post<{ message: string; account: Account }>(`${this.apiUrl}/${accountId}/deposit`, { amount });
  }

  /** Processes a withdrawal from a specific account. */
  withdraw(accountId: string, amount: number): Observable<{ message: string; account: Account }> {
    return this.http.post<{ message: string; account: Account }>(`${this.apiUrl}/${accountId}/withdraw`, { amount });
  }

  /** Transfers funds between two accounts. */
  transfer(fromAccountId: string, toAccountId: string, amount: number): Observable<{ message: string; fromAccount: Account; toAccount: Account }> {
    return this.http.post<{ message: string; fromAccount: Account; toAccount: Account }>(`${this.apiUrl}/transfer`, { fromAccountId, toAccountId, amount });
  }
}