const pgp = require('pg-promise')(/* options */)
const db = pgp(process.env.POSTGRES_DSN)

module.exports = db;
