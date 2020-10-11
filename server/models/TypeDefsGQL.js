const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type User {
        _id: ID!
        userName: String
        email: String
        password: String
    }

    type AuthPayload {
        user: User
    }

    type Query {
        getUsers: [User]
        currentUser: User
    }
    type Mutation {
        updateUser(_id: ID!, userName: String!, email: String!): User
        login(email: String!, password: String!): User
        signup(userName: String!, email: String!, password: String!) : User
        logout: Boolean
    }
`;

module.exports = typeDefs