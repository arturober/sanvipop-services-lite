export default () => ({
  port: parseInt(process.env.PORT ?? '0', 10) || 3000,
  basePath: process.env.BASE_PATH || '',
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT ?? '0', 10) || 5432,
  },
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
});
