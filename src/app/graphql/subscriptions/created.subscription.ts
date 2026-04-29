import gql from 'graphql-tag';

export const INSERTED_USER = gql`
    subscription {
    users {
      id
      name
    }
  }
`;
