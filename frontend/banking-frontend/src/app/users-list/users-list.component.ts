import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Observable, map, of, catchError } from 'rxjs'; 
import { User } from '../models/user';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div class="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg text-center">
        <h2 class="text-4xl font-extrabold text-gray-900 leading-tight">All Users</h2>
        
        <div *ngIf="users$ | async as users">
          <ul *ngIf="users.length > 0; else noUsers" class="space-y-4 text-left">
            <li *ngFor="let user of users" class="p-4 border border-gray-200 rounded-lg">
              <p class="text-lg"><strong>Name:</strong> {{ user.name }}</p>
              <p class="text-sm text-gray-600"><strong>Email:</strong> {{ user.email }}</p>
            </li>
          </ul>
        </div>
        
        <div *ngIf="isLoading">
          <p class="text-indigo-600">Loading users...</p>
        </div>
        
        <div *ngIf="error">
          <p class="text-red-500">{{ error }}</p>
        </div>

        <ng-template #noUsers>
          <p class="text-lg text-red-500">No users found or you are not authorized.</p>
        </ng-template>
      </div>
    </div>
  `,
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  users$!: Observable<User[]>;
  isLoading = true; // Initial loading state
  error: string | null = null; // Property to hold the error message

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.users$ = this.authService.getUsers().pipe(
      map((result: any) => {
        this.isLoading = false; // Set loading to false on success
        this.error = null; // Clear any previous errors
        return result.data.users;
      }),
      catchError((err) => {
        this.isLoading = false; // Set loading to false on error
        this.error = 'Failed to fetch users. Please try logging in again.'; // Set the error message
        return of([]); // Return an empty array to prevent the app from breaking
      })
    );
  }
}
