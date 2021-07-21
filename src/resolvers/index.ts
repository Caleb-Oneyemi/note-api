import Query from './query';
import Mutation from './mutation';
import User from './user';
import Note from './note';
import { GraphQLDateTime } from 'graphql-iso-date';

const resolvers = {
    Query,
    Mutation,
    User,
    Note,
    DateTime: GraphQLDateTime
}

export default resolvers;