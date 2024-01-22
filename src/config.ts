import { config } from 'dotenv';
config();

export default {
  port: process.env.PORT,
  transportUrl: process.env.GOV_TRANSPORT_URL,
  weatherUrl: process.env.GOV_WEATHER_URL,
  geocodeUrl: process.env.GEOCODE_URL,
  geocodeApiKey: process.env.GEOCODE_API_KEY,
};
