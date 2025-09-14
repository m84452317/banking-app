// src/app/apollo.config.ts

import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { Provider } from '@angular/core';

const uri = 'http://localhost:4000/graphql'; // <-- IMPORTANT: Update with your GraphQL API URL

export function createApolloProvider(): Provider {
  return {
    provide: APOLLO_OPTIONS,
    useFactory: (httpLink: HttpLink) => {
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({ uri }),
      };
    },
    deps: [HttpLink],
  };
}