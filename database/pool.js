'use strict';

const mysql = require('promise-mysql');

const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER_NAME_LOCAL,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_LOCAL_NAME,
  charset: 'utf8mb4',
  debug: false
});

module.exports = pool;