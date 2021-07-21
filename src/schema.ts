import { gql } from 'apollo-server-express';

const typeDefs = gql`
    scalar DateTime

    type User {
        id: ID!
        username: String!
        email: String!
        avatar: String!
        notes: [Note!]!
        favorites: [Note!]!
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type Note {
        id: ID!
        content: String!
        author: User!
        favoriteCount: Int!
        favoritedBy: [User!]
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type NoteFeed {
        notes: [Note]!
        cursor: String!
        hasNextPage: Boolean!
    }

    type Query {
        hello: String
        notes: [Note!]!
        note(id: ID!): Note
        user(username: String!): User
        users: [User!]!
        me: User!
        noteFeed(cursor: String): NoteFeed
    }

    type Mutation {
        signUp(username: String!, email: String!, password: String!): String!
        signIn(username: String, email: String, password: String!): String!
        newNote(content: String!): Note
        updateNote(id: ID!, content: String!): Note
        deleteNote(id: ID!): Boolean!
        toggleFavorite(id: ID!): Note!
    }
`;

export default typeDefs;