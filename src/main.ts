import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: 'https://graphql-pokemon2.vercel.app' }),
    cache: new InMemoryCache(),
  };
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideAnimationsAsync(),
    Apollo, // <--- Adiciona o serviço Apollo no DI
    HttpLink, // <--- Adiciona HttpLink também
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
});
