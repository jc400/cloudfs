const sqlite3 = require('sqlite3').verbose()
const { readFile } = require('fs/promises')
const path = require('path')


async function init_db() {
    const schema = await readFile(path.join(__dirname, 'schema.sql'), 'utf8');
    const db = get_db();

    db.serialize(() => {
        db.run(schema);
    })
    .close();

    console.log('initialized database');
}

function get_db() {
    const db = new sqlite3.Database(path.join(__dirname, 'instance', 'db.sqlite'));
    return db;
}

exports.init_db = init_db;
exports.get_db = get_db;
