import axios from 'axios';
import { Injectable } from '@nestjs/common';

import { config } from '../config';
import { CoordinateType } from '../common/types/coordinates';
import { LocationTrafficImageType } from '../traffic/types/traffic';
import { STATUS_CODE } from '../common/constants/status';
import {
  CoordinateDistanceType,
  GeocodingType,
  ReverseGeocodingResponseType,
} from './types/geolocation';

import {
  REDIS_KEY_NAMESPACES,
  RedisService,
} from '../common/utils/redis.service';

@Injectable()
export class GeolocationService {
  constructor(private readonly redisService: RedisService) {}

  geocodeUrl = `${config.geocodeUrl}?key=${config.geocodeApiKey}&q=`;

  async getReverseGeocode(
    coordinate: CoordinateType,
  ): Promise<ReverseGeocodingResponseType> {
    const { latitude, longitude } = coordinate || {};
    const url = `${this.geocodeUrl}${latitude}+${longitude}`;
    return await axios.get(url);
  }

  getGeocodeRedisKey = ({ latitude, longitude }: CoordinateType): string =>
    `${REDIS_KEY_NAMESPACES.GEOCODE}-${latitude}-${longitude}`;

  async getReverseGeocodeOnRedis(coordinate: CoordinateType) {
    return await this.redisService.getValue(
      this.getGeocodeRedisKey(coordinate),
    );
  }

  async getLocationNamesFromCoordinates(
    locations: Array<LocationTrafficImageType>,
  ): Promise<Array<LocationTrafficImageType>> {
    if (!locations?.length) return [];

    const locationWithNames = await Promise.all(
      locations.map(async (location) => {
        try {
          const nameFromRedis = await this.getReverseGeocodeOnRedis(location);

          if (nameFromRedis) {
            return { ...location, name: nameFromRedis };
          }

          const result = await this.getReverseGeocode(location);

          const nameFromApi = this.getLocationNameFromGeocodingResult(
            result.data,
          );

          await this.redisService.setValue(
            this.getGeocodeRedisKey(location),
            nameFromApi,
          );

          return { ...location, name: nameFromApi };
        } catch (e) {
          console.warn('Location name not found', e);
          return location;
        }
      }),
    );

    return locationWithNames.filter((location) => location.name);
  }

  getLocationNameFromGeocodingResult = (data: GeocodingType): string => {
    const { status, results } = data || {};
    if (status?.code !== STATUS_CODE.SUCCESS) return '';

    const { road, suburb } = results?.[0]?.components || {};
    if (!road && !suburb) return '';

    return [road, suburb].join(', ');
  };

  calculateCoordinateDistance(
    latitude1: number = 0,
    longitude1: number = 0,
    latitude2: number = 0,
    longitude2: number = 0,
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
    const NEAR_DISTANCE = 100;
    let nearest: CoordinateDistanceType = null;

    for (const coordinate of coordinates) {
      const distance = this.calculateCoordinateDistance(
        latitude,
        longitude,
        coordinate.latitude,
        coordinate.longitude,
      );

      if (nearest?.distance == null || distance < nearest.distance) {
        nearest = { ...coordinate, distance };
      }
    }

    const { distance } = nearest || {};
    if (distance != null && distance > NEAR_DISTANCE) return null;

    return nearest;
  }
}
