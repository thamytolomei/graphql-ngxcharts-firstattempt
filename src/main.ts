import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import {
  InMemoryCache,
  ApolloClientOptions,
  split,
} from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';

import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

import { provideHttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideAnimationsAsync(),
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      // 🌱 Pokémon API para QUERIES
      const pokemonHttp = httpLink.create({
        uri: 'https://graphql-pokemon2.vercel.app',
      });

      // 🔧 Hasura HTTP (Mutations)
      const hasuraHttp = httpLink.create({
        uri: 'https://daring-amoeba-87.hasura.app/v1/graphql',
      });

      // 🌐 Hasura WebSocket (Subscriptions)
      const hasuraWs = new GraphQLWsLink(
        createClient({
          url: 'wss://daring-amoeba-87.hasura.app/v1/graphql',
        })
      );

      // 🧠 Split entre mutation/subscription (Hasura) e query (Pokémon)
      const link = split(
        ({ query }) => {
          const def = getMainDefinition(query);
          if (def.kind === 'OperationDefinition') {
            return def.operation === 'mutation' || def.operation === 'subscription';
          }
          return false;
        },
        // Se for mutation/subscription → Hasura (split interno para HTTP ou WS)
        split(
          ({ query }) => {
            const def = getMainDefinition(query);
            return def.kind === 'OperationDefinition' && def.operation === 'subscription';
          },
          hasuraWs,
          hasuraHttp
        ),
        // Se for query → Pokémon API
        pokemonHttp
      );

      return {
        link,
        cache: new InMemoryCache(),
      } as ApolloClientOptions<any>;
    }),
  ],
});
