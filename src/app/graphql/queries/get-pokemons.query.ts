export const GET_POKEMONS_QUERY = `
{
  pokemons(first: 150) {
    id
    name
    types
    weight {
      minimum
       maximum
    }
  }
}
`
