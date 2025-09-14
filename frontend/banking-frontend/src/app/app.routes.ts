import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersListComponent } from './users-list/users-list.component';
import { authGuard } from './auth.guard';
import { AccountsComponent } from './accounts/accounts/accounts.component';
import { LoansComponent } from './loans/loans.component';
import { AdminLoanApprovalComponent } from './admin-loan-approval/admin-loan-approval.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'users',
    component: UsersListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'loans',
    component: LoansComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/loans',
    component: AdminLoanApprovalComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];