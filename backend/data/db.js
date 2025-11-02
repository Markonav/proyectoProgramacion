const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = process.env.DB_PATH;

let dbPath;
if (DB_PATH) {
  // si DB_PATH es absoluta úsala tal cual, si no resuélvela relativo al working dir (donde arrancas node)
  dbPath = path.isAbsolute(DB_PATH) ? DB_PATH : path.resolve(process.cwd(), DB_PATH);
} else {
  // por defecto usar app/data local al propio módulo (backend/data/app.db)
  dbPath = path.join(__dirname, 'app.db');
}

const db = new Database(dbPath, { verbose: process.env.DEBUG_DB ? console.log : undefined });

module.exports = db;
