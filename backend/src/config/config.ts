export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  db: {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: 'student',
    password: 'student',
    databaseName: 'kupipodariday',
  },
  JWT_SECRET: 'JWT_SECRET',
});
