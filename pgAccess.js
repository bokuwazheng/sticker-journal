require('dotenv').config();

const options = {
  query: function (e) {
    console.log(e.query);
  },
};
const pgp = require('pg-promise')(options);
const types = require('pg').types;

types.setTypeParser(types.builtins.TIMESTAMPTZ, function(val) {
  return val.toString();
});

const config = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};

const db = pgp(config);

module.exports = {
  pgp: pgp,
  db: db
}