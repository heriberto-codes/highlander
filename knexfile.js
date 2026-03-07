const os = require('os');

const shared = {
  pool: {
    min: 0,
    max: 10
  },
  migrations: {
    directory: 'data/migrations'
  }
};

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'highlander',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || os.userInfo().username,
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8'
    },
    seeds: {
      directory: 'data/seeds'
    },
    debug: process.env.KNEX_DEBUG === 'true',
    useNullAsDefault: true,
    ...shared
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: process.env.DB_SSL === 'false'
            ? false
            : (process.env.DB_SSL_INSECURE === 'true'
              ? { rejectUnauthorized: false }
              : { rejectUnauthorized: true })
        }
      : {
          host: process.env.DB_HOST || '127.0.0.1',
          database: process.env.DB_NAME || 'highlander',
          port: Number(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || os.userInfo().username,
          password: process.env.DB_PASSWORD || ''
        },
    seeds: {
      directory: 'data/prod_seeds'
    },
    ...shared
  }
};
