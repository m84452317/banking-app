import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common'; // Import AsyncPipe
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../state/app.state';
import { selectAuthUser } from '../selectors/auth.selectors';
import { User } from '../models/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AsyncPipe], // Add AsyncPipe to imports
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user$!: Observable<User | null>;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.user$ = this.store.select(selectAuthUser);
  }
} 