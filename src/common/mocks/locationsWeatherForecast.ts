export const areaForecasts = [
  { area: 'Area1', forecast: 'Sunny' },
  { area: 'Area2', forecast: 'Rainy' },
];

export const areaMetadata = [
  { name: 'Area1', label_location: { latitude: 1.291, longitude: 103.85 } },
  { name: 'Area2', label_location: { latitude: 1.3974, longitude: 103.854 } },
];

export const mappedLocationWeatherForecasts = [
  { name: 'Area1', forecast: 'Sunny', latitude: 1.291, longitude: 103.85 },
  { name: 'Area2', forecast: 'Rainy', latitude: 1.3974, longitude: 103.854 },
];

export const mockedWeatherResponse = {
  data: {
    area_metadata: areaMetadata,
    items: [
      {
        forecasts: areaForecasts,
      },
    ],
  },
};
