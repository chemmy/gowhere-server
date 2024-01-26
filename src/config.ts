import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export const config = {
  port: process.env.PORT,
  transportUrl: process.env.GOV_TRANSPORT_URL,
  weatherUrl: process.env.GOV_WEATHER_URL,
  geocodeUrl: process.env.GEOCODE_URL,
  geocodeApiKey: process.env.GEOCODE_API_KEY,
};

export const dbConfig = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true, // only for development
  entities: ['dist/**/*.entity.{ts,js}'],
};

export default {
  config,
  dbConfig,
};
