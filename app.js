"use strict";
const graphql = require("graphql");
const express = require("express");
const expressJwt = require('express-jwt');
const expressGraphQL = require("express-graphql").graphqlHTTP;
const jwt = require('jsonwebtoken');
const { GraphQLSchema } = graphql;
const { query } = require("./schemas/queries");
const { mutation } = require("./schemas/mutations");

const jwtMiddleWare = expressJwt({ secret: process.env.JwtSecret, algorithms: ['HS256']}).unless({ path: ['/login'] });

const schema = new GraphQLSchema({
  query,
  mutation
});

const port = process.env.PORT || 3000;
const app = express(port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(jwtMiddleWare); // comment for testing

const errorMW = function errorHandler(err, req, res, next) {
  if (typeof (err) === 'string') {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === 'UnauthorizedError') {
    // jwt authentication error
    return res.status(401).json({ message: 'Invalid Token' });
  }

  // default to 500 server error
  return res.status(500).json({ message: err.message });
}

app.use(errorMW);

app.get('/login', (req, res) => {
  const { login, password } = req.body;
  if (login !== process.env.BotLogin || password !== process.env.BotPassword) {
    return res.status(401).send('Wrong login or password.');
  }
	const token = jwt.sign(login, process.env.JwtSecret);
	res.send({ token });
});

app.use(
  '/',
  expressGraphQL({
    schema: schema,
    graphiql: true
  })
);

app.listen(port);