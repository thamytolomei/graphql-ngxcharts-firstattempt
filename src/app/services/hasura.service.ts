import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HasuraService {

  // 🔹 Definição da mutation inline
  private readonly INSERT_USER_MUTATION = gql`
    mutation insertUser($name: String!) {
      insert_users(objects: { name: $name }) {
        returning {
          id
          name
        }
      }
    }
  `;

  // 🔹 Definição da subscription inline
  private readonly GET_USERS_SUBSCRIPTION = gql`
    subscription {
      users {
        id
        name
      }
    }
  `;

  constructor(private readonly apollo: Apollo) {}

  // 📤 Método para criar um novo usuário
  createUser(name: string): Observable<any> {
    return this.apollo.mutate({
      mutation: this.INSERT_USER_MUTATION,
      variables: { name },
    });
  }

  // 🔁 Método para escutar todos os usuários em tempo real
  getUsers(): Observable<any> {
    return this.apollo.subscribe({
      query: this.GET_USERS_SUBSCRIPTION,
    });
  }
}
