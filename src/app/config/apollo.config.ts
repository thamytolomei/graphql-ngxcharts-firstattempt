import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

// A factory que cria as opções do Apollo
export function apolloFactory(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: 'https://graphql-pokemon2.vercel.app' }),
    cache: new InMemoryCache(),
  };
}

export const APOLLO_PROVIDERS = [
  {
    provide: APOLLO_OPTIONS,
    useFactory: apolloFactory,
    deps: [HttpLink],
  }
];
