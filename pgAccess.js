require('dotenv').config();
const pgPromise = require('pg-promise');
const types = require('pg').types;

const pgp = pgPromise({}); // Empty object means no additional config required

types.setTypeParser(types.builtins.TIMESTAMPTZ, function(val) {
  return val.toString();
});

const config = {
  host: process.env.DbHost,
  port: process.env.DbPort,
  database: process.env.Db,
  user: process.env.DbUser,
  password: process.env.DbPassword
};

const db = pgp(config);

exports.db = db;