import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  userId: string;
  role: string;
  exp?: number;
}

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private apollo = inject(Apollo);

  init$ = createEffect(() =>
  of(localStorage.getItem('token')).pipe(
    map((token) => {
      if (token) {
        const user = this.authService.getUserFromToken(token);
        return AuthActions.loginSuccess({ token, user });
      } else {
        return { type: 'NO_ACTION' };
      }
    })
  )
);


/*   init$ = createEffect(() =>
    of(localStorage.getItem('token')).pipe(
      map((token) => {
        if (token) {
          const user = { name: 'Refreshed User', email: 'user@example.com', id: 'placeholder' };
          return AuthActions.loginSuccess({ token, user });
        } else {
          return { type: 'NO_ACTION' };
        }
      })
    )
  ); */

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ email, password }) =>
        this.authService.login(email, password).pipe(
          map((response: any) => {
            // Corrected to handle the GraphQL response structure
            return AuthActions.loginSuccess({
              token: response.data.login.token,
              user: response.data.login.user,
            });
          }),
          catchError((error) => {
            return of(AuthActions.loginFailure({ error }));
          })
        )
      )
    )
  );

  
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => {
          // Store token
          localStorage.setItem('token', token);

          // Decode token to extract user info
          const payload = jwtDecode<TokenPayload>(token);
          const user = { id: payload.userId, role: payload.role };

          // Store user info
          localStorage.setItem('user', JSON.stringify(user));

          // Navigate
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

/*   loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token, user }) => {
          localStorage.setItem('token', token);
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );
 */
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      switchMap(({ name, email, password }) =>
        this.authService.signup(name, email, password).pipe(
          map((response: any) => {
            // Corrected to handle the GraphQL response structure
            return AuthActions.signupSuccess({
              token: response.data.createUser.token,
              user: response.data.createUser.user,
            });
          }),
          catchError((error) => {
            return of(AuthActions.signupFailure({ error }));
          })
        )
      )
    )
  );

signupSuccess$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(AuthActions.signupSuccess),
      tap(({ token, user }) => {
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
      })
    ),
  { dispatch: false }
);
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          this.apollo.client.clearStore();
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}