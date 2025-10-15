const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, 'app.db');
const db = new Database(dbPath, { verbose: process.env.DEBUG_DB ? console.log : undefined });

module.exports = db;
