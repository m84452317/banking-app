import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import {jwtDecode} from 'jwt-decode';

interface TokenPayload {
  userId: string;
  role: string;
  exp?: number;
}

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;
/* const SIGNUP_MUTATION = gql`
  mutation CreateUser($name: String!, $email: String!, $password: String!) {
    createUser(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`; */

const GET_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo) {}
  getUserFromToken(token: string) {
    const payload = jwtDecode<TokenPayload>(token);
    return {
      id: payload.userId,
      name: 'Unknown',
      email: '',
      role: payload.role
    };
  }

  login(email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: LOGIN_MUTATION,
      variables: { email, password },
    });
  }

  signup(name: string, email: string, password: string): Observable<any> {
    alert(`name = ${name} email = ${email} password - ${password}`)
    return this.apollo.mutate({
      mutation: SIGNUP_MUTATION,
      variables:{input: { name, email, password }},
    });
  }

  getUsers(): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_USERS_QUERY,
    }).valueChanges;
  }
}