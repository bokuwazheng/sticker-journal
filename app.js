"use strict";
const graphql = require("graphql");
const express = require("express");
const expressJwt = require('express-jwt');
const expressGraphQL = require("express-graphql").graphqlHTTP;
const jwt = require('jsonwebtoken');
const { GraphQLSchema } = graphql;
const { query } = require("./schemas/queries");
const { mutation } = require("./schemas/mutations");

const port = process.env.PORT || 3000;
const app = express(port);

const schema = new GraphQLSchema({
  query,
  mutation
});

const jwtMiddleware = expressJwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256']}).unless({ path: ['/login'] });

const errorMiddleware = function(err, req, res, next) {
  console.error(err.stack);
  return res.status(500).json({ message: err.message });
}

process.on('unhandledRejection', error => {
  console.error('unhandled', error);
})

process.on('uncaughtException', error => {
  console.error('uncaught', error);
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.ENVIRONMENT === 'Development') {
  app.use(
    '/graphql',
    expressGraphQL({
      schema: schema,
      graphiql: true
    })
  );
}
else {
  app.use(jwtMiddleware);
  app.use(
    '/graphql',
    expressGraphQL({
      schema: schema
    })
  );
}

app.get('/login', (req, res) => {
  const { login, password } = req.body;
  if (login !== process.env.BOT_LOGIN || password !== process.env.BOT_PASSWORD) {
    return res.status(401).send('Wrong login or password.');
  }
  const token = jwt.sign(login, process.env.JWT_SECRET);
  res.send({ token });
});

app.use(errorMiddleware);

app.listen(port);