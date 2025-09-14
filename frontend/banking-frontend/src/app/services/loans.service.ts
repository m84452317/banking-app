import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from '../models/loan';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4000/api/loans';
  constructor() { }

  getLoans(): Observable<Loan[]> {
    return this.http.get<Loan[]>(`${this.apiUrl}/myloans`);
  }

  applyLoan(loanApplication: { loanType: string; principalAmount: number; interestRate: number; termMonths: number }): Observable<Loan> {
    // Correctly map frontend names to backend names
    const requestBody = {
      loanType: loanApplication.loanType,
      amount: loanApplication.principalAmount, // Mapped to 'amount'
      interestRate: loanApplication.interestRate,
      tenureMonths: loanApplication.termMonths // Mapped to 'tenureMonths'
    };
    return this.http.post<Loan>(`${this.apiUrl}/apply`, requestBody);
  }

  repayLoan(loanId: string, amount: number): Observable<Loan> {
    return this.http.post<Loan>(`${this.apiUrl}/${loanId}/pay`, { amount });
  }

  // Admin feature
  approveLoan(loanId: string): Observable<Loan> {
  return this.http.patch<Loan>(`${this.apiUrl}/${loanId}/status`, { status: "approved" });
}

  getPendingLoans(): Observable<Loan[]> {
    alert('loan service getpending loans...')
    return this.http.get<Loan[]>(`${this.apiUrl}/pending`);
}

}