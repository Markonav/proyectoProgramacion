const Database = require('better-sqlite3');
const db = new Database('./app.db');


// Crear tabla libros si no existe
db.exec(`
CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    autor TEXT NOT NULL,
    categoria TEXT NOT NULL,
    PrecioRenta INTEGER NOT NULL,
    cover TEXT,
    sinopsis TEXT,  
    tendencia INTEGER CHECK (tendencia IN (0,1)) DEFAULT 0,
    masLeido INTEGER CHECK (masLeido IN (0,1)) DEFAULT 0,
    novedad INTEGER CHECK (novedad IN (0,1)) DEFAULT 0
);
`);

// Crear tabla categorias si no existe
db.exec(`
CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL UNIQUE
);
`);

// Crear tabla usuarios si no existe
db.exec(`
CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    public_id TEXT UNIQUE,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    favoritos TEXT,
    nombre TEXT,
    apellido TEXT,
    nickname TEXT,
    avatar TEXT
);
`);

    
console.log('Base de datos inicializada');