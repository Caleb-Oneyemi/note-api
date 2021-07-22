import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import { connect } from './db';
import { server } from './apollo-server';

dotenv.config();
const app =  express();
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST as string;

connect(DB_HOST);

app.use(helmet());
app.use(cors());

server.start().then(() => {
    server.applyMiddleware({ app, path: '/api' });
})

app.listen({ port }, () => {
    console.log(`GraphQL Server running at http://localhost:${port}${server.graphqlPath}`)
})