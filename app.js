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

const jwtMiddleWare = expressJwt({ secret: process.env.JwtSecret, algorithms: ['HS256']}).unless({ path: ['/login'] });

const errorMW = function errorHandler(err, req, res, next) {
  console.error(err.stack);
  return res.status(500).json({ message: err.message });
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(jwtMiddleWare);

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
app.use(errorMW);

app.listen(port);