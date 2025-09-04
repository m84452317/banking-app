import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5"; // Import from the new package
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load env variables
dotenv.config();

const app = express();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Apollo GraphQL setup
const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello Banking App Backend ",
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
    // Start the Apollo Server
    await server.start();

    // Use expressMiddleware to integrate Apollo Server with Express
    app.use(
        '/graphql', // This is the path for your GraphQL endpoint
        cors(),
        express.json(),
        expressMiddleware(server)
    );

    // Start Express server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(` Server ready at http://localhost:${PORT}/graphql`);
    });
};

startServer();


// ******below code is the first version of this file
/* import express from "express";
// import { ApolloServer } from "apollo-server-express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Load env variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

// Apollo GraphQL setup (basic placeholder)
const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello Banking App Backend ",
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
await server.start();
server.applyMiddleware({ app });

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}${server.graphqlPath}`);
});
 */