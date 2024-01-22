export type LocationWeatherForecastType = {
  name: string;
  forecast: string;
  latitude: number;
  longitude: number;
};

export type AreaMetadataType = {
  name: string;
  label_location: {
    latitude: number;
    longitude: number;
  };
};

export type ForecastType = {
  area: string;
  forecast: string;
};

export type WeatherForecastResponseType = {
  data: {
    area_metadata: Array<AreaMetadataType>;
    items: Array<{
      forecasts: Array<ForecastType>;
      timestamp: string;
      update_timestamp: string;
      valid_period: {
        start: string;
        end: string;
      };
    }>;
  };
};
