import axios from 'axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  LocationTrafficImageType,
  TrafficCameraType,
  TrafficImagesResponseType,
} from './types/traffic';
import config from 'src/config';

@Injectable()
export class TrafficService {
  mapTrafficImageToLocationTraffic(
    camera: TrafficCameraType,
  ): LocationTrafficImageType {
    const { camera_id, location, image } = camera;

    return {
      id: camera_id,
      latitude: location.latitude,
      longitude: location.longitude,
      image,
    };
  }

  async getTrafficImages(
    datetime: string,
  ): Promise<Array<LocationTrafficImageType>> {
    const TRAFFIC_URL = `${config.transportUrl}/traffic-images`;

    try {
      const { data }: TrafficImagesResponseType = await axios.get(
        `${TRAFFIC_URL}?date_time=${datetime}`,
      );
      const cameras = data?.items?.[0]?.cameras || [];

      return cameras.map(this.mapTrafficImageToLocationTraffic);
    } catch (error) {
      throw new InternalServerErrorException(error.messages);
    }
  }
}
