const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://postgres:password@db/app')

module.exports = db;
