import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    users: [User]!
    bikes: [Bike]!
    user(id:ID!): User
    bike(id:ID!): Bike
    actualUser: User!
  }
  type User {
    id: ID!
    name: String!
    created: String!
    expires: String!
    sessionKey: String!
  }
  type Bike {
    id: ID!
    name: String!
    latitude: Float!
    longitude: Float!
    rented: Boolean!
    user: User
  }
  input BikeInput {
    id: ID!,
    name: String
  }
  input UserInput {
    id: ID!,
    name: String
  }
  type Mutation {
    createUser(name: String!, sessionKey: String!): User!
    rentBikeStart(bike: BikeInput): Bike!
    rentBikeFinish(bike: BikeInput): Bike!
    dropAllRents: [Bike]!
  }
  type Subscription {
    bikeStatusChanged: Bike
  }
`;