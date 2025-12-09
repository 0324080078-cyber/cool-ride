import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Get database URL from environment or use a sensible default
const getDatabaseUrl = (): string => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // If no DATABASE_URL, try building from individual parts
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '5432';
  const dbName = process.env.DB_NAME || 'coolrides_db';
  const dbUser = process.env.DB_USER || 'coolrides_user';
  const dbPassword = process.env.DB_PASSWORD || 'coolrides_pass';
  
  return `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
};

const databaseUrl = getDatabaseUrl();

const sequelize = new Sequelize(
  databaseUrl,
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

export { sequelize };
