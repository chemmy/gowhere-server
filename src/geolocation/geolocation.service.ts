import axios from 'axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import config from 'src/config';
import { CoordinateType } from 'src/common/types/coordinates';
import { LocationTrafficImageType } from 'src/traffic/types/traffic';
import { STATUS_CODE } from 'src/common/constants/status';
import {
  CoordinateDistanceType,
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

  calculateCoordinateDistance(
    latitude1: number,
    longitude1: number,
    latitude2: number,
    longitude2: number,
  ): number {
    const earthRadius = 6371;

    const deltaLatitude = (latitude2 - latitude1) * (Math.PI / 180);
    const deltaLongitude = (longitude2 - longitude1) * (Math.PI / 180);

    const haversineA =
      Math.sin(deltaLatitude / 2) * Math.sin(deltaLatitude / 2) +
      Math.cos(latitude1 * (Math.PI / 180)) *
        Math.cos(latitude2 * (Math.PI / 180)) *
        Math.sin(deltaLongitude / 2) *
        Math.sin(deltaLongitude / 2);

    const haversineC =
      2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));

    const distance = earthRadius * haversineC;

    return distance;
  }

  findNearestCoordinates(
    latitude: number,
    longitude: number,
    coordinates: Array<CoordinateType>,
  ): CoordinateDistanceType {
    const NEAR_DISTANCE = 5;
    let nearest: CoordinateDistanceType = null;

    for (const coordinate of coordinates) {
      const distance = this.calculateCoordinateDistance(
        latitude,
        longitude,
        coordinate.latitude,
        coordinate.longitude,
      );

      if (!nearest?.distance || distance < nearest.distance) {
        nearest = { ...coordinate, distance };
      }
    }

    const { distance } = nearest;
    if (distance && distance > NEAR_DISTANCE) return null;

    return nearest;
  }
}
