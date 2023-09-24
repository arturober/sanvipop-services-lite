export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  basePath: process.env.BASE_PATH || '',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
