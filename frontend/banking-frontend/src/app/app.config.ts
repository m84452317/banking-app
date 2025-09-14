import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { HttpLink } from 'apollo-angular/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { routes } from './app.routes';
import { authReducer } from './reducers/auth.reducer';
import { AuthEffects } from './effects/auth.effects';
import { AuthService } from './services/auth.service';
import { authInterceptor } from './auth.interceptor';
import { LoanService } from './services/loans.service';

const uri = 'http://localhost:4000/graphql';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),

    // Apollo Client Configuration
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const authLink = setContext((operation, { headers }) => {
          const token = localStorage.getItem('token');
          return {
            headers: {
              ...headers,
              authorization: token ? `Bearer ${token}` : '',
            }
          };
        });

        const link = authLink.concat(httpLink.create({ uri }));

        return {
          cache: new InMemoryCache(),
          link,
        };
      },
      deps: [HttpLink],
    },
    Apollo,
    HttpLink,

    // Your custom AuthService and new LoanService
    AuthService,
    LoanService,

    // NgRx Configuration
    provideStore({ auth: authReducer }),
    provideEffects(AuthEffects),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ]
};