import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import * as AuthActions from '../actions/auth.actions';
import * as AuthSelectors from '../selectors/auth.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading$!: Observable<boolean>;
  error$!: Observable<any>;

  constructor(private fb: FormBuilder, private store: Store<any>) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.isLoading$ = this.store.select(AuthSelectors.selectAuthIsLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
  }

  onSubmit(): void {
    console.log('on submit sign up');
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;
      alert(`name = ${name} email = ${email} password - ${password}`)
      this.store.dispatch(AuthActions.signup({ name, email, password }));
    }
    alert(`user registered...`)
  }
}
