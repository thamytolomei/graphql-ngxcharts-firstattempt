import gql from 'graphql-tag';

export const INSERT_USER = gql`
  mutation insertUser($name: String!) {
    insert_users(objects: { name: $name }) {
      returning {
        id
        name
      }
    }
  }
`;
