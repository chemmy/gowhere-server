import { CoordinateType } from '../../common/types/coordinates';

export type GeocodingType = {
  status: {
    code: number;
    message: string;
  };
  results: Array<{
    components: {
      road: string;
      suburb: string;
    };
    formatted: string;
  }>;
};

export type ReverseGeocodingResponseType = {
  data: GeocodingType;
};

export type CoordinateDistanceType = CoordinateType & { distance: number };
