import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logout } from './actions/auth.actions';
import { User } from './models/user';
import { selectAuthUser } from './selectors/auth.selectors';
import { AppState } from './state/app.state';
import * as AuthActions from './actions/auth.actions';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, AsyncPipe],
  template: `
    <header class="bg-gray-800 text-white p-4">
      <nav class="container mx-auto flex justify-between items-center">
        <a routerLink="/dashboard" class="text-xl font-bold">Banking App</a>
        <div class="flex items-center space-x-4">
          <a *ngIf="(user$ | async)?.role === 'customer'" routerLink="/dashboard" routerLinkActive="font-bold">Dashboard</a>
          <a *ngIf="(user$ | async)?.role === 'customer'" routerLink="/accounts" routerLinkActive="font-bold">Accounts</a>
          <a *ngIf="(user$ | async)?.role === 'customer'" routerLink="/loans" routerLinkActive="font-bold">Loans</a>

          <a *ngIf="(user$ | async)?.role === 'admin'" routerLink="/admin/loans" routerLinkActive="font-bold">Admin Loans</a>

          <!-- <a *ngIf="user$ | async" routerLink="/dashboard" routerLinkActive="font-bold">Dashboard</a> -->
          <!-- <a *ngIf="user$ | async" routerLink="/accounts" routerLinkActive="font-bold">Accounts</a> -->
          <!-- <a *ngIf="user$ | async" routerLink="/loans" routerLinkActive="font-bold">Loans</a> -->
          <!-- <a *ngIf="(user$ | async)?.role === 'admin'" routerLink="/admin/loans" routerLinkActive="font-bold">Admin Loans</a> -->
          <div *ngIf="user$ | async">
            <span class="text-sm">Welcome, {{ (user$ | async)?.name }}</span>
            <button (click)="onLogout()" class="ml-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded-md text-sm">Logout</button>
          </div>
          <div *ngIf="!(user$ | async)">
            <a routerLink="/login" routerLinkActive="font-bold" class="mr-2">Login</a>
            <a routerLink="/signup" routerLinkActive="font-bold">Sign Up</a>
          </div>
        </div>
      </nav>
    </header>
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  user$!: Observable<User | null>;

  /*  ngOnInit(): void {
     this.user$ = this.store.select(selectAuthUser);
   } */

  ngOnInit(): void {
    this.user$ = this.store.select(selectAuthUser);

    // Restore user from localStorage if store is empty
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user: User = JSON.parse(storedUser);
      // Dispatch action to set user in store (optional)
      this.store.dispatch(AuthActions.loginSuccess({ token: localStorage.getItem('token')!, user }));
    }
  }

/*   onLogout(): void {
    this.store.dispatch(logout());
    this.router.navigate(['/login']);
  } */

    onLogout(): void {
  this.store.dispatch(logout());
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.router.navigate(['/login']);
}

}