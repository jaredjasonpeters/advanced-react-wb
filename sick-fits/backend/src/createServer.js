const { GraphQLServer } = require('graphql-yoga');
const prisma = require('./db')
const Mutation = require('./resolvers/Mutation');
const Query = require('./resolvers/Query');

function createServer() {
  
  return new GraphQLServer({
    typeDefs: 'src/schema.graphql',
    resolvers: {
      Mutation,
      Query
    },
    resolverValidationOptions: {
      requireResolversForResolveType: false
    },
    context: req => {
      return {
        ...req,
        db: prisma
      }
    },
  });
}

module.exports = createServer