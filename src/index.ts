import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import cors from 'cors';
import depthLimit from 'graphql-depth-limit';
import { createComplexityLimitRule } from 'graphql-validation-complexity';
import { connect } from './db';
import models from './models';
import typeDefs from './schema';
import resolvers from './resolvers';

dotenv.config();
const app =  express();
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST as string;

connect(DB_HOST);

app.use(helmet());
app.use(cors());

const getUser = (token: string) => {
    if (token) {
        try {
            return jwt.verify(token, process.env.JWT_SECRET as string);
        } catch (err) {
            throw new Error('Session invalid');
        }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [ depthLimit(5), createComplexityLimitRule(1000) ],
    context: ({ req }) => {
        const token = req.headers.authorization;
        const user = getUser(token as string);
        return { models, user };
    }
});

server.start().then(() => {
    server.applyMiddleware({ app, path: '/api' });
})

app.listen({ port }, () => {
    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
})