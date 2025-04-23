export const GET_POKEMONS_WITH_ATTACKS_QUERY = `
  {
    pokemons(first: 80) {
      id
      number
      name
      types
      image
      attacks {
        fast {
          name
          damage
        }
        special {
          name
          damage
        }
      }
    }
  }
`;
