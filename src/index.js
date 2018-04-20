const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: (root, args, context, info) => context.db.query.links({}, info),
  },
  Mutation: {
      // 2
      post: (root, args, context, info) => {
        return context.db.mutation.createLink({ // data
          url: args.url,
          description: args.description,
        }, info)
      },

      updateLink: (root, args, context, info) => {
          return context.db.mutation.updateLink({ // data
              description: args.description,
              url: args.url,
            },
            { // where
              id: args.id,
            },
          )
      },

      deleteLink: (root, args) => {
        return context.db.mutation.updateLink({ // where
            id: args.id,
          },
        )
      }
  }
}

// 3
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://us1.prisma.sh/public-ebonyhead-700/graphql-example/dev',
      secret: 'mysecret123',
      debug: true,
    }),
  }),
})
server.start(() => console.log(`Server is running on http://localhost:4000`))
