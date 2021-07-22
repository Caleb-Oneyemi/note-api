import { ApolloServer } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import models from './models';
import typeDefs from './schema';
import resolvers from './resolvers';

const getUser = (token: string) => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (err) {
            throw new Error('Session invalid');
        }
    }
};

export const server = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [ depthLimit(5), createComplexityLimitRule(1000) ],
    context: ({ req }) => {
        const token = req.headers.authorization;
        const user = getUser(token as string);
        return { models, user };
    }
});