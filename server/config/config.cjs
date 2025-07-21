// config/config.cjs
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    username: process.env.POSTGRES_USER || 'chatapp',
    password: process.env.POSTGRES_PASSWORD || 'chatapp',
    database: process.env.POSTGRES_DB || 'chatapp_db',
    host: process.env.POSTGRES_HOST || 'db',
    dialect: 'postgres',
  },
};
