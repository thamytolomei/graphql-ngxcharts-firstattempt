import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GET_POKEMONS_QUERY } from '../graphql/queries/get-pokemons.query';
import { GET_POKEMONS_WITH_ATTACKS_QUERY } from '../graphql/queries/get-pokemons-with-attachs.query';

@Injectable({
  providedIn: 'root',
})
export class PokemonGraphqlService {
  constructor(private apollo: Apollo) {}

  getPokemons() {
    return this.apollo.query({
      query: gql(GET_POKEMONS_QUERY)
    }).pipe(
      map((result: any) => result.data['pokemons'])
    );
  }

  getPokemonsWithAttacks() {
    return this.apollo.query({
      query: gql(GET_POKEMONS_WITH_ATTACKS_QUERY)
    }).pipe(
      map((result: any) => result.data['pokemons'])
    );
  }
}
