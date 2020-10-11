// Imports. These are our import packages //
const express = require("express");
const session = require("express-session");
const dotenv = require('dotenv')
const mongoose = require('mongoose')
import passport from 'passport';
const { ApolloServer } = require('apollo-server-express');
const bcrypt = require('bcrypt')
import { buildContext } from 'graphql-passport';
const cors = require('cors')
import { v4 as uuidv4 } from 'uuid';

const typeDefs = require('./models/TypeDefsGQL.js')
const resolvers = require('./models/ResolversGQL.js')
import initPassport from './passport'
import User from './models/mongooseModels'


const SECRET_KEY = 'Keyboard_Cat'

const WS_PORT = 8888;

//Defining the Apollo Server Instance

initPassport({ User });


// dotEnv config.
dotenv.config()

//Setting express info
const app = express();

app.use(session({
  genid: (req) => uuidv4(),
  secret: SECRET_KEY,
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session())

const corsOptions = {
  origin: ['http://localhost:19006', 'exp://192.168.1.24:19000', 'http://192.168.1.24:19001'],
  credentials: true,
};
app.use(cors(corsOptions));


//Express Routes
//app.use('/api', routes);

// Defining Port. Process.env for pre defined ports. ex. Azure
const port = process.env.PORT || 3333;

//Defining our database connection. Which should be in a .env file or as a server variable
const dbRoute = process.env.DB_ROUTE

//Database connection
mongoose.connect(dbRoute, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
});

//defining db connection
let DB = mongoose.connection;

//Starting the db server
DB.once('open', () => console.log('connected to the database'));
DB.on('error', console.error.bind(console, 'MongoDB connection error:'));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => buildContext({ req, res, User }),
  playground: {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
});

//Applying express to Apollo
server.applyMiddleware({ app, cors: false });


    //Starting the actual server
    app.listen(port, () => {
      console.log(`App listening on PORT ${port} and Apollo on http://localhost:3000${server.graphqlPath} `);
    });


//Serving the actual react
var path = require("path");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", function (req, res) {
   res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}
