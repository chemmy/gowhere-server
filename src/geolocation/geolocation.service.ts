import axios from 'axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import config from 'src/config';
import { CoordinateType } from 'src/common/types/coordinates';
import { LocationTrafficImageType } from 'src/traffic/types/traffic';
import { STATUS_CODE } from 'src/common/constants/status';
import {
  GeocodingType,
  ReverseGeocodingResponseType,
} from './types/geolocation';

import mockGeocodedLocation from '../common/mocks/geocodedTrafficLocations';

@Injectable()
export class GeolocationService {
  geocodeUrl = `${config.geocodeUrl}?key=${config.geocodeApiKey}&q=`;

  async getReverseGeocode(
    coordinate: CoordinateType,
  ): Promise<ReverseGeocodingResponseType> {
    const { latitude, longitude } = coordinate || {};
    const url = `${this.geocodeUrl}${latitude}+${longitude}`;
    return await axios.get(url);
  }

  async getLocationNamesFromCoordinates(
    locations: Array<LocationTrafficImageType>,
  ): Promise<Array<LocationTrafficImageType>> {
    if (!locations?.length) return [];

    // REMOVE MOCK
    return mockGeocodedLocation;

    // Mock used because of api request limit

    const promises = locations.map((location) =>
      this.getReverseGeocode(location),
    );

    try {
      const results: Array<ReverseGeocodingResponseType> =
        await Promise.all(promises);

      return locations.map((location, idx) => {
        const name = this.getLocationNameFromGeocodingResult(
          results[idx]?.data,
        );
        return { ...location, name };
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  getLocationNameFromGeocodingResult = (data: GeocodingType): string => {
    const { status, results } = data || {};
    if (status?.code !== STATUS_CODE.SUCCESS) return '';

    const { road, suburb } = results?.[0]?.components || {};
    if (!road && !suburb) return '';

    return [road, suburb].join(', ');
  };
}
