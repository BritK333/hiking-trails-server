require('dotenv').config();
const { ApolloServer, gql } = require('apollo-server')
const _ = require('lodash')
const cors = require('cors')
const { sortBy, filter } = require('lodash')
// json file with data
const hikingTrails = require('./JSON/hikingTrails.json')


const typeDefs = gql`
   type Trails {
      id: ID
      name: String
      city: String  
      location: String
      difficulty: String
      length: String
      time: String
   }

   type Query {
      trailsMany: [Trails!]!                                # lists all trails
      trailsOne(id: ID!): Trails!                           # returns one trail by id
      trailsByCity(city: String): [Trails]                  # lists trails by city 
      trailsByDifficulty(difficulty: String): [Trails]      # list trails by difficulty level
   }
`
const resolvers = {
   Query: {
      trailsMany: (_) =>  {
         // _.sortBy(users, ['user', 'age']); e.g. from lodash/sortBy docs
         return sortBy(hikingTrails, [hikingTrails.id])
      },
      trailsOne: ( _, {id} ) => {
         return (hikingTrails) [id]
      },
      trailsByCity: ( _, {city} ) => {
         return filter(hikingTrails, {city} ) 
         // using filter method: 
         // https://www.graphql-tools.com/docs/resolvers/ 
      },
      trailsByDifficulty: ( _, {difficulty} ) => {
         return filter( hikingTrails, {difficulty} )
      }
   } 
}


const server = new ApolloServer({
   cors: true,
   typeDefs,
   resolvers,
   introspection: true,
   engine: {    
      apiKey: process.env.APOLLO_KEY, 
      reportSchema: true,
      variant: "current"
    }
})



server.listen({ port: process.env.PORT || 4000 }).then(({url}) => {
   console.log(`🚀  Brit, the server is ready at ${url}`);
})