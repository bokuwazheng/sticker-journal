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
  host: process.env.DbHost,
  port: process.env.DbPort,
  database: process.env.Db,
  user: process.env.DbUser,
  password: process.env.DbPassword
};

const db = pgp(config);

module.exports = {
  pgp: pgp,
  db: db
}